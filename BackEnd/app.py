from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import datetime
import jwt

# Flask 앱 생성 & CORS 설정
app = Flask(__name__)
CORS(app)
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
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# 스레드 Thread
class Thread (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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

    # 기본 유효성 검사 : 모든 필드 누락
    if not username or not email or not password:
        return jsonify({"Error" : "모든 필드를 입력해주세요."}), 400 #실패
    
    # 사용자 및 이메일 중복 확인하기
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"Error" : "이미 존재하는 사용자의 이름 또는 이메일입니다."}), 409 #실패
    
    # 비밀번호 해싱 시키기
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # 사용자 생성 및 DB에 추가시킴
    new_user = User(username=username, password=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message" : f"'{username}'이(가) 회원가입되었습니다."}), 201 #성공

# 로그인 API
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
        # 비밀번호 일치하면 JWT 생성
        payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) #1시간 후 티켓 만료 시킴
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({"token": token}), 200
    else:
        # 인증 실패
        return jsonify({"error": "잘못된 사용자, 비밀번호입니다."}), 401

