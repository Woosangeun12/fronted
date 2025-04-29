import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPageSty.css';
import pxArt from "../../assets/pxArt-3.png";

const LandingPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nickname.trim() === "123456") {
      navigate('/admin'); // 관리자 페이지로 이동
    } else if (nickname.trim()) {
      try {
        // API 요청
        const response = await axios.post('/api/user/join', { nickname });
        const { visitorId } = response.data;

        // 세션에 저장
        sessionStorage.setItem('nickname', nickname);
        sessionStorage.setItem('visitorId', visitorId);

        // 다음 페이지로 이동
        navigate('/survey');
      } catch (error) {
        console.error('닉네임 등록 실패:', error);
        console.log("LandingPage import 경로 확인용"); // 👈 이 줄 추가
        alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="landing-container">
      <img src={pxArt} alt="달과 구름" className="landing-image" />
      <form onSubmit={handleSubmit} className="landing-form">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="landing-input"
        />
        <button type="submit" className="landing-button">시작하기</button>
      </form>
    </div>
  );
};

export default LandingPage;
