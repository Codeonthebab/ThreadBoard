import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
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

  const navigate = useNavigate();
  const { login } = useAuth(); //AuthContext.tsx에 login 함수

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

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
        // 응답 성공 시 토큰 저장
        login((data as LoginSuccessResponse).token);
        navigate("/");
      } else {
        // 응답 실패 시 에러 메세지
        setError((data as LoginErrorResponse).error);
      }
    } catch (err) {
      console.error("로그인 요청 실패 : ", err);
      setError("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>{t("login")}</h3>
        <div>
          <label htmlFor="username">{t("id")}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{t("login")}</button>
      </form>
    </>
  );
}

export default LoginPage;
