from flask import Blueprint, jsonify
from .auth import token_required
from ..models import Notification
from ..extensions import db

notifications_bp = Blueprint('notifications', __name__)

# 알림 목록 API
@notifications_bp.route('/notifications', methods=['GET'])
@token_required
def get_notifications(current_user) :
    # 현재 로그인한 사용자의 알림을 모두 조회
    # is_read 컬럼에 따라 정렬 (안 읽은 알림이 먼저 오도록)
    notifications = Notification.query.filter_by(recipient_id=current_user.id).order_by(Notification.created_at.desc()).all()

    notifications_data = [{
        'id' : notification.id,
        'sender_id' : notification.sender_id,
        'thread_id' : notification.thread_id,
        'notification_type' : notification.notification_type,
        'is_read' : notification.is_read,
        'created_at' : notification.created_at.isoformat()
    } for notification in notifications]

    return jsonify (notifications_data), 200

# 알림 목록에서 읽음 처리하는 is_read 상태로 변경하는 API
@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['POST'])
@token_required
def mark_notification_as_read (current_user, notification_id) :
    notification = Notification.query.get(notification_id)
    
    if not notification :
        return jsonify({'error' : '존재하지 않는 알림입니다.'}), 404
    
    
    if not notification.is_read :
        notification.is_read = True
        db.session.commit()
    
    return jsonify({'message' : '알림을 읽음 처리했습니다.'}), 200