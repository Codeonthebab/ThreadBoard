import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import insertThread from './pages/insertThread.tsx';
import MainPage from './pages/mainpage.tsx';

function App() {

  // {언어변경 등의 인스턴스}
  const {i18n} = useTranslation();

  return (
    <div className="App">
      <div>
        <header>
        <button onClick={()=> i18n.changeLanguage('ko')}>🇰🇷 한국어</button>
        <button onClick={()=> i18n.changeLanguage('ja')}>🇯🇵 日本語</button>
        <button onClick={()=> i18n.changeLanguage('en')}>🇺🇸 English</button>
        </header>
      </div>
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
