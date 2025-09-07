import { useState } from 'react';

type RegisterSuccecssResponse={
    message: string;
};

type RegisterErrorResponse={
    Error: string;
};

function Register() {
  // 각 입력 값을 관리할 State를 생성
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // 입력된 폼이 실행될 함수
  const handleSubmit = async (event: React.FormEvent) => {
    // 폼 제출 시 페이지 새로고침 막기
    event.preventDefault();

    try {
      // 파이썬 백엔드 APIdp fetch로 POST 요청
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/userProc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data : RegisterSuccecssResponse | RegisterErrorResponse = await response.json();

      if (response.ok) {
        alert((data as RegisterSuccecssResponse).message);
      } else {
        alert(`오류: ${(data as RegisterErrorResponse).Error}`);
      }
    } catch (error) {
      console.error("회원가입 요청 실패 : ", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원가입</h3>
      <div>
        <label>아이디 : </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>비밀번호 : </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label>이메일 : </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit">가입하기</button>
    </form>
  );
}

export default Register;
