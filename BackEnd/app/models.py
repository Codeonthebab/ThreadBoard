import datetime
from .extensions import db # db 객체를 확장 모듈에서 꺼내올 것. 익스텐션 안에 있음

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