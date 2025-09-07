import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css"; // 드롭다운 스타일을 위한 CSS 파일

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false); // 언어 선택 후 메뉴 닫기
  };

  return (
    <div className="language-dropdown">
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        🌐 {t('language')}
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <button onClick={() => handleLanguageChange("ko")}>🇰🇷 한국어</button>
          <button onClick={() => handleLanguageChange("ja")}>🇯🇵 日本語</button>
          <button onClick={() => handleLanguageChange("en")}>🇺🇸 English</button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
