import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/csicon.png'; // 실제 로고 이미지

function LogoSection() {
  return (
    <Link to="/" className="logo-section-link">
      <div className="logo-section">
        <div className="logo-frame">
          <img src={logoImage} alt="Threadly" className="logo" />
        </div>
        {/* 필요시 배경 또는 다른 장식 추가 */}
      </div>
    </Link>
  );
}

export default LogoSection;