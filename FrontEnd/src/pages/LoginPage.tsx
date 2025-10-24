import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

type LoginSuccessResponse = {
  token: string;
};

type LoginErrorResponse = {
  error: string;
};

function LoginPage() {
  const { t } = useTranslation();

  // 로그인 useState로 담아두기
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); //AuthContext.tsx에 login 함수

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001";

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginSuccessResponse | LoginErrorResponse =
        await response.json();

      if (response.ok) {
        // 응답 성공 시 토큰을 Context에 저장
        login((data as LoginSuccessResponse).token);
        navigate("/");
      } else {
        // 응답 실패 시 에러 메세지
        const errorMessage = 
        (data as LoginErrorResponse).error || t("login_failed");
        setError(errorMessage);
      }
    } catch (err) {
      console.error("로그인 요청 실패 : ", err);
      setError("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // Login 요청이 끝나면 로딩 상태 부분 비활성화
    }
  };

  return (
    // 전체 페이지 컨테이너 설정부터
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {t("login")}
        </h2>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이디 입력 필드 */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              {/*t("id")*/}
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border 
              border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="ID"
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {/*t("password")*/}
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 
              text-gray-800 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="***********"
            />
          </div>

          {/* 로그인 버튼 필드 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 
            font-semibold text-white bg-indigo-600 rounded-md shadow-sm
            hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? t("submitting_to_login") : t("login")}
            </button>
          </div>

        </form>

        {/* 회원가입 링크 필드 */}
        <div className="text-sm text-center">
          <span className="text-gray-600">{t('None_account')}</span>
          <Link to ="/signup" 
          className="font-medium text-indigo-600 
          hover:text-indigo-500">
            &nbsp; {t('signup')}
          </Link>
        </div>

        {/* 회원 정보(비번, 아디) 조회 필드 */}
        <div className="text-sm text-center">
          <span className="text-gray-600">{t('Nomemory_Password')}</span>
          <Link to ="/forgot-password"
          className="font-medium text-indigo-600
          hover:text-indigo-500">
           {/*&nbsp; {t('forgot_password')}*/}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
