import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';
import pxArt from "../../assets/pxArt-3.png"; // 동일 이미지 사용

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/landing');
  };

  return (
    <div className="start-container">
        <div className="start-stars"></div> {/* ⭐ 추가! */}
        <div className="start-image-wrapper">
            <img src={pxArt} alt="달과 구름" className="start-image" />
            <h1 className="start-overlay-text">나의 마음은 어떤 영화와 어울릴까?</h1>
        </div>
      <button onClick={handleStart} className="start-button">
        테스트 시작하기
      </button>
    </div>
  );
};

export default StartPage;
