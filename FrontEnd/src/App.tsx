import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";
import InsertThread from "./pages/insertThread.tsx";
import Register from "./pages/RegisterPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import LanguageSwitcher from "./contexts/LanguageSwitcher.tsx";


function App() {
   const { t } = useTranslation();

  return (
    <div className="App">
      <header className="app-header-bar">
        <nav>
          <Link to="/login" style={{ marginRight: '10px'}}>{t('login')}</Link>
          <Link to="/signup">{t('signup')}</Link>
        </nav>
        <LanguageSwitcher/>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/insert-thread" element={<InsertThread />} />
          <Route path="/signup" element={<Register/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
