from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

#데이터베이스 객체 생성
db = SQLAlchemy()
bcrypt = Bcrypt()

"""
로컬에서 비밀번호 잃어버림... test1으로 비밀번호 수정
test_password = 'test1'
test_hashed_password = bcrypt.generate_password_hash(test_password).decode('utf-8')
print(test_hashed_password)
"""