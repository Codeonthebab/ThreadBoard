from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from itsdangerous import URLSafeTimedSerializer

#데이터베이스 객체 생성
db = SQLAlchemy()
bcrypt = Bcrypt()

s = None # App 컨택스트 안에서 SECRET_KEY로 초기화

def init_extensions(app):
    global s
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])