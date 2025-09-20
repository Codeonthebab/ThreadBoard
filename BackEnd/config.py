import os

#if os.environ.get('FLASK_ENV')=='development':
from dotenv import load_dotenv # 로컬을 위함    
load_dotenv() # 로컬 구동을 위함

"""FLASK 설정 파일"""
class Config:

    #보안키 설정 기존 값 그대로 가져갈껀데 환경변수가 필요할 듯, 
    SECRET_KEY = os.environ.get('SECRET_KEY', 'holyMoly_4d23krgwtf_holydoly_a1s11b32nbf')

    #데이터베이스 설정 : DB(PostgreSQL)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Mail 설정 // Render 정책으로 인해 SendGrid 변경
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')