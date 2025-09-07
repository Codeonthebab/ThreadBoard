import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./pages/insertThread.tsx";
import MainPage from "./pages/mainpage.tsx";
import LanguageSwitcher from "./contexts/LanguageSwitcher.tsx";

function App() {

  return (
    <div className="App">
      <header><LanguageSwitcher/></header>
      <body>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/insert-thread" element={<insertThread />} />
        </Routes>
      </body>
    </div>
  );
}

export default App;
