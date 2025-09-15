from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

#데이터베이스 객체 생성
db = SQLAlchemy()
bcrypt = Bcrypt()
