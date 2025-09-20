import { Routes, Route, Link } from "react-router-dom";
import LoginState from "./components/LoginState";
import "./App.css";
import InsertThread from "./pages/insertThread";
import Register from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import NoticePage from "./pages/NoticePage";
import LanguageSwitcher from "./contexts/LanguageSwitcher";
import { Verify } from "crypto";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="app-header-bar">
        <div className="header-left">
          <Link to="/" className="header-logo">
            {t("site_title")}
          </Link>
        </div>

        <nav className="header-center">
        <Link to="/notice" className="header-nav-link">
        {t('Notice')}
        </Link>
        {/* 추가 메뉴 구성하면 링크 투로 만들꺼 */}
        </nav>

        <div className="header-right">
        <LoginState />
        <LanguageSwitcher />
        </div>
      </header>


      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/insert-thread" element={<InsertThread />} />
          {/* 나중에 상세 보드 보기 페이지 추가할 것 */}
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
