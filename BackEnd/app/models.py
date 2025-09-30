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
    view_count = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
# 관계 설정 추가함 
# (POST모델과 관계, 'thread'라는 객체에서 .posts 속성을 통해 연결된 모든 Post객체들의 리스트에 접근이 가능함)
    posts=db.relationship('Post', backref='thread', lazy=True, cascade="all, delete-orphan")

# 게시물 Post
class Post (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    depth = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    ip = db.Column(db.String(100), nullable=False)

# 알림 기능 Notification
class Notification (db.Model) :
    id = db.Column(db.Integer, primary_key=True)
    # 알림 수신
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # 알림 발신
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # 알림 발생한 해당 게시물
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=True)
    # 알림 발생한 해당 댓글
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)
    # 해당 알림의 종류
    notification_type = db.Column(db.String(50), nullable=False)
    # 알림 확인 여부
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    # 알림 시간
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    # 관계 설정 (User 모델과 관계)
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref='notifications_received')
    sender = db.relationship('User', foreign_keys=[sender_id], backref='notifications_sent')
    
# 스레드별 익명 ID 모델
class AnonymousId(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)
    # 특정 스레드 내에서 사용될 8자리 임시 ID
    anonymous_id = db.Column(db.String(8), nullable=False)

    # user_id와 thread_id의 조합이 항상 고유하도록 제약조건 설정
    __table_args__ = (db.UniqueConstraint('user_id', 'thread_id', name='_user_thread_uc'),)