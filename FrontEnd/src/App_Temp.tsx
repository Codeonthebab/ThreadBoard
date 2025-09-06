import { useTranslation } from 'react-i18next';
import './App.css';

function App() {

  // {번역함수, 언어변경 등의 인스턴스}
  const {t,i18n} = useTranslation();

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
        <h1>{t('welcome')}</h1>
        <p>{t('information')}</p>
        <p>
          <button onClick={()=> insertThread()}>{t('new_thread')}</button>
        </p>
      </body>
      </div>
  );
}

export default App;
