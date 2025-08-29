from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import datetime

# Flask 앱 생성 & CORS 설정
app = Flask(__name__)
CORS(app)

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

