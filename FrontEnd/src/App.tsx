import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import InsertThread from "./pages/insertThread";
import Register from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import LanguageSwitcher from "./contexts/LanguageSwitcher";

function App() {
  const { t } = useTranslation();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="app-header-bar">
        <nav>
          {token ? (
            <button onClick={handleLogout}>{t("logout")}</button>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: "10px" }}>
                {t("login")}
              </Link>
              <Link to="/signup">{t("signup")}</Link>
            </>
          )}
        </nav>
        <LanguageSwitcher />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/insert-thread" element={<InsertThread />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
