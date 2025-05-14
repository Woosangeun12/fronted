import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LastPage.css';
import pxArt from '../../assets/pxArt-3_5.png'; // 시작 페이지와 동일한 이미지

export default function LastPage() {
  const navigate = useNavigate();

  return (
    <div className="lastpage-container">
      <img src={pxArt} alt="pixel art" className="lastpage-image" />

      <p className="lastpage-message">
        감사합니다,<br />
        앞으로 더 노력하는 말랑이가 되겠습니다 💌
      </p>

      <button className="lastpage-button" onClick={() => navigate('/')}>
        처음으로
      </button>
    </div>
  );
}
