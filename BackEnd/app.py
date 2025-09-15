

#from flask_mail import Mail, Message
import SignatureExpired

# 이메일 인증을 위한 임시 토큰 생성
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

#메인 페이지 라우팅 (서버가 잘 켜졌는지 확인하는 용도)
@app.route('/')
def index():
    return "<h1>백엔드 서버 동작 중! (*Flask API*)</h1>"



# # Flask-Mail 설정 // Render 정책으로 인해 SendGrid 변경
# app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
# app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
# app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
# app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
# app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')
# mail = Mail(app) #객체 생성해놓기





# 스레드 생성 API (로그인 필요)
@app.route('/threads', methods=['POST'])
@token_required #이 데코레이터는 토큰 검사 전용 데코레이터! 붙이면 이제 검사하는거
def create_thread(current_user):
    data = request.json
    title = data.get('title')
    content = data.get('content')

    if not title:
        return jsonify({'error': '제목을 입력해주세요.'}), 400

    # 로그인 사용자의 ID를 사용, 스레드 생성
    new_thread = Thread(title=title, user_id=current_user.id)
    db.session.add(new_thread)
    db.session.flush() #잠시 세션에 담아두는 것
    
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    first_post = Post(
        content=content,
        thread_id=new_thread.id,
        user_id=current_user.id,
        ip=ip_address
    )
    
    db.session.add(first_post)
    db.session.commit() #최종 커밋
    
    return jsonify({
        'message': f"'{current_user.username}'님이 새 스레드를 생성했습니다.",
        'thread_id': new_thread.id
        }), 201

# 특정 스레드, 모든 게시물 조회 API 
@app.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread_with_posts(thread_id):
    #URL에 되있는 ID를 이용해 특정 스레드 조회함
    thread = Thread.query.get(thread_id)

    if not thread:
        return jsonify({"error": "해당 스레드를 찾을 수 없습니다."}), 404
    
    # 스레드 정보를 딕셔너리로 변환하는 코드
    thread_data = {
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id
    }

    # 딕셔너리에 정의된 것들을 이용, 모든 게시물 조회
    posts_data=[{
        'id': post.id,
        'content': post.content,
        'created_at': post.created_at.isoformat(),
        'user_id': post.user_id
    } for post in thread.posts]

    # 스레드 정보 게시물 목록 반환 시킴
    return jsonify({
        "thread": thread_data,
        "posts": posts_data
    })