import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type RegisterSuccecssResponse = {
  message: string;
};

type RegisterErrorResponse = {
  Error: string;
};

function Register() {
  const { t } = useTranslation();

  // 에러, 로딩 상태 저장
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 각 입력 값을 관리할 State를 생성
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [location, setlocation] = useState("Korea");

  // 메일 폼 제출 확인
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState(""); //서버 메세지 저장

  // 입력된 폼이 실행될 함수
  const handleSubmit = async (event: React.FormEvent) => {
    // 폼 제출 시 페이지 새로고침 막기
    event.preventDefault();

    // 로딩, 에러 값
    setError(null);
    setLoading(true);

    // 오류 확인하기 위한 코드 한줄 필요한듯..
    console.log("Connection to API URL : ", process.env.REACT_APP_API_BASE_URL);

    try {
      // 파이썬 백엔드 APIdp fetch로 POST 요청
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/userProc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email, location }),
        }
      );

      const data: RegisterSuccecssResponse | RegisterErrorResponse =
        await response.json();

      if (response.ok) {
        setMessage((data as RegisterSuccecssResponse).message);
        setIsSubmitted(true);
      } else {
        alert(`오류: ${(data as RegisterErrorResponse).Error}`);
      }
    } catch (error) {
      console.error("회원가입 요청 실패 : ", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 성공 후 보여줄 화면 : 이메일 인증 관련
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("signup_success_title")}
          </h2>
          <p className="text-gray-600">{message}</p>
          <p className="text-gray-600">{t("check_your_email")}</p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {t("login_toppage")}
          </Link>
        </div>
      </div>
    );
  }

  // 회원가입 폼
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {t("signup")}
        </h2>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID 부분 */}
          <div>
            <label>{t("id")} : </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* 패스워드 부분 */}
          <div>
            <label>{t("password")} : </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* 이메일 인증 부분 */}
          <div>
            <label>{t("email")} : </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* 지역 부분 */}
          <div>
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-700"
            >
              {t("location")} :
            </label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Korea">대한민국</option>
              <option value="United State">United States</option>
              <option value="Japan">日本</option>
            </select>
          </div>
          {/* 회원가입 버튼 부분 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
              rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? t("submitting_register") : t("signup")}
            </button>
          </div>
        </form>

        {/* 계정이 있는 경우 */}
        <div className="text-sm text-center">
          <span className="text-gray-600">{t('you_got_account')}</span>
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
