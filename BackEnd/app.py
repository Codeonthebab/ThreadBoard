from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# Flask 앱 생성 & CORS 설정
app = Flask(__name__)
CORS(app)

#데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thread_board.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#데이터베이스 객체 생성
db = SQLAlchemy(app)

#메인 페이지 라우팅 (서버가 잘 켜졌는지 확인하는 용도)
@app.route('/')
def index():
    return "<h1>백엔드 서버 동작 중! (*Flask API*)</h1>"

# User, Thread, Post