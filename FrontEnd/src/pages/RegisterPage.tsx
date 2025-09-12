import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RegisterSuccecssResponse = {
  message: string;
};

type RegisterErrorResponse = {
  Error: string;
};

function Register() {
  const { t } = useTranslation();

  // 각 입력 값을 관리할 State를 생성
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [location, setlocation] = useState("");

  // 메일 폼 제출 확인
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState(""); //서버 메세지 저장

  // 입력된 폼이 실행될 함수
  const handleSubmit = async (event: React.FormEvent) => {
    // 폼 제출 시 페이지 새로고침 막기
    event.preventDefault();

    try {
      // 파이썬 백엔드 APIdp fetch로 POST 요청
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/userProc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, location }),
      });

      const data: RegisterSuccecssResponse | RegisterErrorResponse = await response.json();

      if (response.ok) {
        setMessage((data as RegisterSuccecssResponse).message);
        setIsSubmitted(true);
      } else {
        alert(`오류: ${(data as RegisterErrorResponse).Error}`);
      }
    } catch (error) {
      console.error("회원가입 요청 실패 : ", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  if (isSubmitted) {
    return (
      <>
      <h3>{t('signup_success_title')}</h3>
      <p>{message}</p>
      <p>{t('check_your_email')}</p>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{t('signup')}</h3>
      <div>
        <label>{t('id')} : </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>{t('password')} : </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label>{t('email')} : </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>{t('location')} : </label>       
          <select name="location" value={location} onChange={(e)=> setlocation(e.target.value)}>
            <option value="Korea" >대한민국</option>
            <option value="United State">United States</option>
            <option value="Japan">日本</option>
          </select>
      </div>

      <button type="submit">{t('signup')}</button>
    </form>
  );
}

export default Register;
