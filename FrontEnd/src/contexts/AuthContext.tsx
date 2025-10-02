import React, { createContext, useContext, useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';

interface User{
    user_id: number;
    username: string;
    exp : number;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children : React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState<User | null>(null);

    // 컴포넌트가 처음 마운트 될 때, 한 번만 실행
    useEffect(() => {
        if (token) {
            try {
                const decodedUser : User = jwtDecode(token);
                setUser(decodedUser);
                console.log('User from Login ? => ', decodedUser);
            } catch (err) {
                console.error("Invalid token :", err);

                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);
    // 의존성 배열이 비어있어서 이 컴포넌트 실행될 때, 토큰이 있는지 확인하는 용도로 사용

    // 로그인 함수
    const login = (newToken: string) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('authToken'); // localStorage에서 토큰을 삭제함
        setToken(null); // 로그인 함수에서 저장해놨던 뉴토큰을 이제 널로 상태 변경한 후 토큰 초기화
        setUser(null); // 로그아웃하면 안에 들어있던 디코딩 정보 초기화
    };

    // Context를 통해 전달할 값, "login, logout" 함수를 객체로 묶어놓음
    const value = { token, login, logout, user };
    
    return (
        <AuthContext.Provider value={ value }>
            {children}
        </AuthContext.Provider>
    );
};

// 훅을 커스텀해놓음 : 다른 컴포넌트에서 useAuth로 Context 값을 쉽게 쓸수 있게 캡슐화 시켜놓는 것
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};