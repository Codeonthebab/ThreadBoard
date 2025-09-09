import { Routes, Route } from "react-router-dom";
import LoginState from "./components/LoginState";
import "./App.css";
import InsertThread from "./pages/insertThread";
import Register from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import LanguageSwitcher from "./contexts/LanguageSwitcher";

function App() {

  return (
    <div className="App">
      <header className="app-header-bar">
        <LoginState/>
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
