import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/csicon.png'; // 실제 로고 이미지

function LogoSection() {
  return (
    <Link to="/" className="logo-section-link">
      <div className="logo-section">
        <div className="logo-frame" style={{ width: '50px', height:'50px' }}>
          <img src={logoImage} 
          alt="Threadly" 
          className="logo"
          style={{width:'100%', height:'100%', objectFit:'contain'}} />
        </div>
        {/* 필요시 배경 또는 다른 장식 추가 */}
      </div>
    </Link>
  );
}

export default LogoSection;