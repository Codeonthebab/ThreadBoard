import { Routes, Route } from "react-router-dom";
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

function App() {

  return (
    <div className="App">
      <header className="app-header-bar">
        <button onClick={()=>NoticePage}/>
        <LoginState/>
        <LanguageSwitcher />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Notice" element={<NoticePage />} />
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
