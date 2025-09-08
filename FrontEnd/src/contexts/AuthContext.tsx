import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    // 컴포넌트가 처음 마운트 될 때, 한 번만 실행
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []); // []는 중복 실행 방지할 때 씀
    // 의존성 배열이 비어있어서 이 컴포넌트 실행될 때, localStorage에 토큰이 있는지 확인하는 용도로 사용

    // 로그인 함수
    const login = (newToken: string) => {
        localStorage.setItem('authToken', newToken); // localStorage에 토큰 저장함
         setToken(newToken); // 새로운 토큰 발급하고 리액트의 state에 상태 업데이트 함
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('authToken'); // localStorage에서 토큰을 삭제함
        setToken(null); // 로그인 함수에서 저장해놨던 뉴토큰을 이제 널로 상태 변경한 후 토큰 초기화
    };

    // Context를 통해 전달할 값, "login, logout" 함수를 객체로 묶어놓음
    const value = { token, login, logout };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// 훅을 커스텀해놓음 : 다른 컴포넌트에서 useAuth로 Context 값을 쉽게 쓸수 있게 캡슐화 시켜놓는 것
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};