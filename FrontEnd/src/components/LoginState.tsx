import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

function LoginState() {

    const {t} = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }; 

    return (
        <div className="login-state">
            {user ? ( // if 문 같은거, useAuth에 user 정보를 담아왔다면
        <div>
            <span>{user.username}{t('welcomeuser')}</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}></button>
        </div>
        ) : ( // useAuth에 user 정보 없다면?
            <nav> 
                <Link to="/login" style={{marginRight: '10px'}}>{t('login')}</Link>
                <Link to="/signup">{t('signup')}</Link>
            </nav>
        )}
        </div>
    );
}

export default LoginState;