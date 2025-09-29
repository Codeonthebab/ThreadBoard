import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Notificationbell.css';


interface Notificationbell {
    id : number;
    sender_id : number;
    thread_id : number;
    notification_type : string;
    is_read : boolean;
    created_at : string;
}

function NotificationBell() {
    
    const { t } = useTranslation();
    const { token } = useAuth();
    const [ isOpen, setIsOpen ] = useState(false);
    const [ notifications, setNotifications ] = useState<Notificationbell[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (token) {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch (`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
                        headers : {
                            'Authorization' : `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setNotifications(data);
                    } else {
                        console.error("Failed to fetch notifications : ", await response.text());
                        console.log("알람을 불러오는데 실패했습니다.")
                    }
                } catch (err) {
                    console.error("Failed to fetch notifications : ", err);
                }
            };
            fetchNotifications();
        }
        
        // 바깥쪽 클릭 시 드롭다운 닫기
        const handleClickOutside = (event : MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [token]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className = "notification-bell" ref = {dropdownRef}>
            
            <div onClick={() => setIsOpen(!isOpen)}>
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && (<span className='notification-count'>{unreadCount}</span>)}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">{t('notifications')}</div>
                    {notifications.length > 0 ? (
                        
                        /* 알림이 있을 때 */
                        <ul className = "notification-list">
                            {notifications.map (noti => (
                                <li key={noti.id} className={`notification-item ${!noti.is_read ? 'unread' : ''}`}>
                                    <Link to={`/thread/${noti.thread_id}`} onClick={() => setIsOpen(false)}>
                                        <strong>User {noti.sender_id} </strong> {t('commented_on_your_thread')}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    ) : (
                        /* 알림이 없을 때 */
                        <div className="no-notifications">{t('no_notifications')}</div>
                    )}
                </div>
            )}

        </div>
    );
}

export default NotificationBell;