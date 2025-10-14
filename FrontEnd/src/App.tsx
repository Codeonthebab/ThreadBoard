import { useTranslation } from "react-i18next";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LoginState from "./components/LoginState";
import InsertThread from "./pages/insertThread";
import Register from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import NoticePage from "./pages/NoticePage";
import PopularThreadsPage from "./pages/PopularThreadsPage";
import LatestThreadsPage from "./pages/LatestThreadsPage";
import ThreadInfoPage from "./pages/ThreadInfoPage";
import LanguageSwitcher from "./contexts/LanguageSwitcher";
import LogoSection from "./components/LogoSection";
import NotificationBell from "./components/NotificationBell";
import GamePage from "./pages/GamePage";
import GamePlayerPage from "./pages/GamePlayerPage";
import Footer from "./components/Footer";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";


function App() {

  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="app-header-bar">
        <div className="header-left">
          <LogoSection/>
          <Link to="/" className="header-logo">
            {t("site_title")}
          </Link>
        </div>

        <nav className="header-center">
        
        <Link to="/notice" className="header-nav-link">
        {t('Notice')}
        </Link>

        <Link to="/threads/popular" className="header-nav-link">
        {t('popular_threads')}
        </Link>

        <Link to="/threads/latest" className="header-nav-link">
        {t('latest_threads')}
        </Link>

        <Link to="/games" className="header-nav-link">
        {t('games_page')}
        </Link>

        {/* 추가 메뉴 구성하면 링크 투로 만들꺼 */}
        </nav>

        <div className="header-right">
        <NotificationBell />
        <LoginState />
        <LanguageSwitcher />
        </div>
        
      </header>


      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/insert-thread" element={<InsertThread />} />
          <Route path="/threads/popular" element={<PopularThreadsPage />} />
          <Route path="/threads/latest" element={<LatestThreadsPage />} />
          <Route path="/threads/:thread_id" element={<ThreadInfoPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/games/:gameId" element={<GamePlayerPage />} />
          {/* 나중에 상세 보드 보기 페이지 추가할 것 */}
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </main>

      <Footer />
      
    </div>
  );
}

export default App;
