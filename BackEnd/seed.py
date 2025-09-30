# 더미데이터 및 관리자 계정 테스트
from app import create_app, db
from app.models import User, Thread, Post
from app.extensions import bcrypt

app = create_app()

with app.app_context() :
    # 기존 로컬DB 값 삭제
    print("기존 데이터 삭제함!")
    db.drop_all()
    db.create_all()
    
    # 계정 정보 생성
    print("관리자 계정 생성")
    hashed_password = bcrypt.generate_password_hash('test1').decode('utf-8')
    admin_user = User(
        username = 'admin',
        password = hashed_password,
        email = 'admin@test.com',
        is_verified = True,
        location = 'korea'
    )
    db.session.add(admin_user)
    
    print("일반 사용자 계정 생성")
    hashed_password_user = bcrypt.generate_password_hash('user123').decode('utf-8')
    normal_user = User(
        username = 'testuser',
        password = hashed_password_user,
        email = 'testuser@test.com',
        is_verified = True,
        location = 'United State'
    )
    db.session.add(normal_user)
    
    db.session.commit()
    print("계정 정보 저장 완료")
    
    # 더미 스레드, 게시물 생성
    print("더미 스레드, 게시물 생성")
    thread1 = Thread(title='First Test Thread, 줄여서 FTT', user_id = admin_user.id)
    thread2 = Thread(title='React, Flask is 베리베리 컴포터블!, 아임 미국인!', user_id = normal_user.id)
    db.session.add(thread1)
    db.session.add(thread2)
    db.session.commit()
    print("스레드 정보 저장 완료")
    
    post1 = Post(content = "FTT의 부록 쑤레드 입니다.", thread_id = thread1.id, user_id = admin_user.id, ip = '127.0.0.1')
    post2 = Post(content = "미국인 친구의 미국인입니다.", thread_id = thread2.id, user_id = admin_user.id, ip = '127.0.0.1')
    db.session.add(post1)
    db.session.add(post2)
    db.session.commit()
    print("그 밑 하위 게시물 정보 저장 완료")
    print("DB Seed Complite")