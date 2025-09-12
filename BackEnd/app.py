from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from functools import wraps
import datetime
import jwt
import os

# Flask 앱 생성 & CORS 설정
app = Flask(__name__)
CORS(app, origins=["https://thread-board.vercel.app"], supports_credentials=True)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY']='holyMoly_4d23krgwtf_holydoly_a1s11b32nbf' # return 부분은 복잡한 문자열로 만들어두는게 좋다

#데이터베이스 설정 : DB(PostgreSQL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://threadboard_user:EBjc41eLhJv5y1YadGTgm20MZ1xLpmVV@dpg-d2o8687diees73ema8c0-a.singapore-postgres.render.com/threadboard'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#데이터베이스 객체 생성
db = SQLAlchemy(app)

#메인 페이지 라우팅 (서버가 잘 켜졌는지 확인하는 용도)
@app.route('/')
def index():
    return "<h1>백엔드 서버 동작 중! (*Flask API*)</h1>"

# User, Thread, Post DB 모델 정의
# 사용자 User
class User (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, nullable=False, default=False)
    location = db.Column(db.String(100), nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# Flask-Mail 설정
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')
mail = Mail(app) #객체 생성해놓기

# 스레드 Thread
class Thread (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
# 관계 설정 추가함 
# (POST모델과 관계, 'thread'라는 객체에서 .posts 속성을 통해 연결된 모든 Post객체들의 리스트에 접근이 가능함)
    posts=db.relationship('Post', backref='thread', lazy=True)


# 게시물 Post
class Post (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    depth = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    ip = db.Column(db.String(45), nullable=False)


# 회원가입 API
@app.route('/userProc', methods=['POST'])
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
        token = s.dumps(email, salt = 'email-confirm-salt')
        
        # 인증 링크 생성 (토큰 발급한거 저기로)
        confirm_url = f"https://thread-board.vercel.app/verify/{token}"

        # 이메일 내용
        subject = "[ThreadBoard] 회원가입 인증 메일"
        html = f"<p> 아래 링크를 클릭하셔서 회원가입을 완료하세요 </p> <br> <p> <a href ='{confirm_url}'>{confirm_url}</a></p>"
        
        # 메세지 객체 생성
        msg = Message(subject, recipients=[email], html=html)

        # 이메일 발송
        mail.send(msg)

        # 이메일 발송 성공 후 사용자 정보를 DB에 저장
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({"message" : f"'{username}'이(가) 회원가입되었습니다. 이메일을 확인하여 계정이 인증되었습니다. "}), 201 #성공
    
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"Error" : "이메일 발송 중 오류가 발생했습니다."}), 500

# 이메일 인증 토큰 API
@app.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    try :
        # 토큰 인증 이메일 추출
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)
    except SignatureExpired:
        # 토큰 만료의 경우
        return jsonify({"Error": "인증 링크 만료"}), 400
    except Exception as e:
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
        


# 로그인 API (JWT Token 활용)
@app.route('/login', methods=['POST'])
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
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

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
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            #토큰 내에서 user_id를 이용해 사용자 정보를 DB에서 조회
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'error': '유효하지 않는 토큰'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated_function

# 스레드 생성 API (로그인 필요)
@app.route('/threads', methods=['POST'])
@token_required #이 데코레이터는 토큰 검사 전용 데코레이터! 붙이면 이제 검사하는거
def create_thread(current_user):
    data = request.json
    title = data.get('title')

    if not title:
        return jsonify({'error': '제목을 입력해주세요.'}), 400
    
    # 로그인 사용자의 ID를 사용, 스레드 생성
    new_thread = Thread(title=title, user_id=current_user.id)
    db.session.add(new_thread)
    db.session.commit()

    return jsonify({'message': f"'{current_user.username}'님이 새 스레드를 생성했습니다."}), 201

# 특정 스레드, 모든 게시물 조회 API
@app.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread_with_posts(thread_id):
    #URL에 되있는 ID를 이용해 특정 스레드 조회함
    thread = Thread.query.get(thread_id)

    if not thread:
        return jsonify({"error": "해당 스레드를 찾을 수 없습니다."}), 404
    
    # 스레드 정보를 딕셔너리로 변환하는 코드
    thread_data = {
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id
    }

    # 딕셔너리에 정의된 것들을 이용, 모든 게시물 조회
    posts_data=[{
        'id': post.id,
        'content': post.content,
        'created_at': post.created_at.isoformat(),
        'user_id': post.user_id
    } for post in thread.posts]

    # 스레드 정보 게시물 목록 반환 시킴
    return jsonify({
        "thread": thread_data,
        "posts": posts_data
    })