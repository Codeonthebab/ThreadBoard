from flask import Blueprint, jsonify, request, current_app
from functools import wraps
import datetime
import jwt
import os
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

"""db, bcrypt, s 객체들과 USER 모델 불러오기"""
from ..extensions import db, bcrypt
from ..models import User

#Blueprint 설정
auth_bp = Blueprint('auth', __name__)

# 회원가입 API
@auth_bp.route('/userProc', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    location = data.get('location')

    # 기본 유효성 검사 : 모든 필드 누락
    if not username or not email or not password or not location :
        return jsonify({"Error" : "모든 필드를 입력해주세요."}), 400 #실패
    
    # 사용자 및 이메일 중복 확인하기
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"Error" : "이미 존재하는 사용자의 이름 또는 이메일입니다."}), 409 #실패
    
    # 비밀번호 해싱 시키기
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # 사용자 생성 및 DB에 추가시킴
    new_user = User(username=username, password=hashed_password, email=email, location=location)
    #db.session.add(new_user)
    #db.session.commit() 이메일 인증하면서 새로운 유저 최종 추가하는걸로 변경

    try :
        # 이메일 토큰 관련
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        token = s.dumps(email, salt = 'email-confirm-salt')
        
        # 인증 링크 생성 (토큰 발급한거 저기로)
        confirm_url = f"https://thread-board.vercel.app/verify/{token}"

        #sendgrid 이메일 발송 관련
        message = Mail(
            from_email=os.environ.get('MAIL_USERNAME'), #환경변수에 메세지 보낼 이메일 Render에 설정
            to_emails=email,
            subject='[ThreadBoard] 회원가입 인증메일',
            html_content=f"<p> 아래 링크를 클릭하셔서 회원가입을 완료하세요</p> <br> <p> <a href='{confirm_url}'>{confirm_url}</a></p>"
        )
        
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY']) #환경변수에 SendGrid API Key Render에 설정
        response = sg.send(message)
        
        # 응답 코드 2XX 아니면 에러
        if response.status_code >= 300:
            # SendGrid에 상태에러 메세지 로그 기록
            print(f"SendGrid API Error Status Code: {response.status_code}")
            print(f"SendGrid API Error Body: {response.body}")
            raise Exception("SendGrid API Error")
        
        # 이메일 내용 // Render 정책으로 SendGrid로 변경
        #subject = "[ThreadBoard] 회원가입 인증 메일"
        #html = f"<p> 아래 링크를 클릭하셔서 회원가입을 완료하세요 </p> <br> <p> <a href ='{confirm_url}'>{confirm_url}</a></p>"
        
        # 메세지 객체 생성 // Render 정책으로 SendGrid로 변경
        #msg = Message(subject, recipients=[email], html=html)

        # 이메일 발송 // Render 정책으로 SendGrid로 변경
        #mail.send(msg)

        # 이메일 발송 성공 후 사용자 정보를 DB에 저장
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({"message" : f"'{username}'이(가) 회원가입되었습니다. 이메일을 확인하여 계정이 인증되었습니다. "}), 201 #성공
    
    except Exception as e:
        db.session.rollback()
       
        # 에러 객체 로그, 상세한 내용 출력
        print(f"An exception of type {type(e).__name__} occurred: {e}")
        # 에러내용의 핵심 메세지 출력 시키는거
        if hasattr(e, 'body'):
            print(f"Error Body: {e.body}")
            
        return jsonify({"Error" : "이메일 발송 중 오류가 발생했습니다."}), 500

# 이메일 인증 토큰 API
@auth_bp.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    try :
        # 토큰 인증 이메일 추출
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)

    except SignatureExpired:
        # 토큰 만료의 경우
        return jsonify({"Error": "인증 링크 만료"}), 400
    
    except Exception as e:
        print(e)
        # 그 외 토큰 오류 시
        return jsonify({"Error": "유효하지 않은 인증 링크입니다."}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"Error": "사용자를 찾을 수 없습니다."}), 404
    
    if user.is_verified:
        return jsonify({"message": "이미 인증된 계정입니다."}), 200
    
    user.is_verified = True
    db.session.commit()
    
    return jsonify({"message": "성공적으로 이메일 인증 완료되었습니다."}), 200
        
# 로그인 API
# 로그인 API (JWT Token 활용)
@auth_bp.route('/login', methods=['POST'])
def login() :
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 공란 기입하면 반환할 if문
    if not username or not password:
        return jsonify({"error" : "사용자의 이름, 비밀번호를 입력해주십시오."}), 400
    
    # DB에서 유저 찾기
    user = User.query.filter_by(username=username).first()

    # 주워온 유저 정보가 존재하고, 비밀번호는 일치하는지 확인하기
    if user and bcrypt.check_password_hash(user.password, password):
        
        # 사용자가 인증됐을 경우를 확인
        if not user.is_verified:
            return jsonify({"Error": "이메일 인증이 완료되지 않은 계정입니다."}), 403
        
        # 비밀번호 일치하면 JWT 생성
        payload = {
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) #1시간 후 티켓 만료 시킴
        }
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({"token": token}), 200
    else:
        # 인증 실패
        return jsonify({"error": "잘못된 사용자, 비밀번호입니다."}), 401
    
# JWT 토큰 검사 데코레이터 (어디 들어갈 때마다 확인하는 일종의 티켓)
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        # 클라이언트가 요청한 Authorization 확인
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'error': '토큰 없음'}), 401 
        
        try:
            #토큰 유효성 검사하는 디코딩
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            #토큰 내에서 user_id를 이용해 사용자 정보를 DB에서 조회
            current_user = User.query.get(data['user_id'])
        except Exception:
            return jsonify({'error': '유효하지 않는 토큰'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated_function

