from flask import Flask 
from flask_cors import CORS
"""config, extensions에서 설정 및 확장 모듈 불러오기"""
from config import Config
from .extensions import db, bcrypt

"""블루프린트 객체들 소환"""
from .routes.auth import auth_bp
from .routes.threads import threads_bp

def create_app(config_class=Config):
    """App 함수들"""
    app = Flask(__name__)
    app.config.from_object(config_class) # 설정 파일 적용

    # CORS 섷정
    CORS(app, origins=["https://thread-board.vercel.app"], supports_credentials=True)

    # 확장 모듈들 초기화
    db.init_app(app)
    bcrypt.init_app(app)

    # Bender에서 portgre DB 연결, 테이블 생성
    with app.app_context():
        db.create_all()

    # 5. 블루프린트(routes) 등록
    app.register_blueprint(auth_bp)
    app.register_blueprint(threads_bp)

    @app.route('/')
    def index():
        return "<h1>백엔드 서버 동작 중! (*Flask API*)</h1>"
    
    return app