from flask import Blueprint, jsonify, request
from .auth import token_required #토큰 검사 데코레이터 호출
from ..extensions import db
from ..models import Thread, Post, User, Notification
from sqlalchemy import func

#Blueprint 설정
threads_bp = Blueprint('threads', __name__)

# 스레드 생성 API
@threads_bp.route('/threads', methods=['POST'])
@token_required #이 데코레이터는 토큰 검사 전용 데코레이터
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

# 스레드 목록 조회 API (페이징 처리 포함)
@threads_bp.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread_with_posts(thread_id):
    #URL에 되있는 ID를 이용해 특정 스레드 조회함
    thread = Thread.query.get(thread_id)

    thread.view_count += 1
    db.session.commit()
    
    if not thread:
        return jsonify({"error": "해당 스레드를 찾을 수 없습니다."}), 404
    
    # 스레드 정보를 딕셔너리로 변환하는 코드
    thread_data = {
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id,
        'view_count': thread.view_count
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

# 인기 스레드 목록 API
@threads_bp.route('/threads/popular', methods=['GET'])
def get_popular_threads():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)

    query = db.session.query(
        Thread,
        func.count(Post.id).label('post_count')
    ).outerjoin(Post).group_by(Thread.id).order_by(
        func.count(Post.id).desc(), Thread.view_count.desc(), Thread.created_at.desc()
    )

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    threads_with_post_count = pagination.items

    threads_data = [{
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id,
        'view_count': thread.view_count,
        'post_count': post_count
    } for thread, post_count in threads_with_post_count]
    
    return jsonify({
        'threads': threads_data,
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages
    })

# 최신 스레드 목록 API
@threads_bp.route('/threads/latest', methods=['GET'])
def get_latest_threads():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)

    query = db.session.query(
        Thread,
        func.count(Post.id).label('post_count')
    ).outerjoin(Post).group_by(Thread.id).order_by(
        Thread.created_at.desc()
    )

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    threads_with_post_count = pagination.items

    threads_data = [{
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id,
        'view_count': thread.view_count,
        'post_count': post_count
    } for thread, post_count in threads_with_post_count]
    
    return jsonify({
        'threads': threads_data,
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages
    })

# 메인 화면 표시 '스레드 목록' API (최신, 인기순)
@threads_bp.route('/threads', methods=['GET'])
def get_thread() :
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    sort_by = request.args.get('sort_by', 'latest', type=str)
    
    query = db.session.query(
        Thread,
        func.count(Post.id).label('post_count')
    ).outerjoin(Post, Thread.id == Post.thread_id).group_by(Thread.id)
    
    if sort_by == 'popular':
        query = query.order_by(func.count(Post.id).desc(), Thread.view_count.desc())
    elif sort_by == 'latest':
        query = query.order_by(Thread.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    threads = pagination.items
    
    threads_data = [{
        'id': thread.id,
        'title': thread.title,
        'created_at': thread.created_at.isoformat(),
        'user_id': thread.user_id,
        'view_count': thread.view_count,
        'post_count': post_count
    } for thread, post_count in threads ]
    
    return jsonify({
        'threads': threads_data,
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages
    })

# 특정 스레드에 새로운 댓글(Thread) 추가 되는거 API
@threads_bp.route('/threads/<int:thread_id>/posts', methods=['POST'])
@token_required
def create_post_in_thread(current_user, thread_id) :
    data = request.json
    content = data.get('content')

    if not content :
        return jsonify({'error': '내용을 입력 해야합니다.'}), 400
    
    thread = Thread.query.get(thread_id)
    if not thread :
        return jsonify({'error' : '존재하지 않는 스레드입니다.'}), 404
    
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)

    new_post = Post(
        content = content, 
        thread_id = thread_id,
        user_id = current_user.id,
        ip = ip_address
    )

    db.session.add(new_post)

    # 알림 생성 로직 : 작성자 제외의 한정으로 알림 생성
    if thread.user_id != current_user.id:
        notification = Notification (
            recipient_id = thread.user_id,  # 알림 수신 : 스레드 주인
            sender_id = current_user.id,    # 알림 발신 : 댓글 단 사람
            thread_id = thread_id,          # 알림 발생한 해당 스레드
            notification_type = 'new_post'  # 알림 종류 : 새 댓글 알림
        )
        db.session.add(notification)

    db.session.commit()

    return jsonify ({
        'message' : '게시물이 작성되었습니다.',
        'post' : {
            'id' : new_post.id,
            'content' : new_post.content,
            'created_at' : new_post.created_at.isoformat(),
            'user_id' : new_post.user_id
        }
    }), 201

# 스레드 삭제 API
@threads_bp.route('/threads/<int:thread_id>', methods=['DELETE'])
@token_required
def delete_thread(current_user, thread_id):
    thread = Thread.query.get(thread_id)
    
    if thread is None:
        return jsonify({'error': '해당 스레드를 찾을 수 없습니다.'}), 404
    
    if thread.user_id != current_user.id:
        return jsonify({'error': '이 스레드를 삭제할 권한이 없습니다.'}), 403
    
    db.session.delete(thread)
    db.session.commit()
    
    return jsonify({'message': '스레드가 성공적으로 삭제되었습니다.'}), 200