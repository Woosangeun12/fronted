import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";
import './LandingPageSty.css';
import pxArt from "../../assets/pxArt-3.png";

const LandingPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const trimmed = nickname.trim(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (nickname.trim()) {
      console.log("🧾 입력한 닉네임:", trimmed);
      console.log("🌐 Axios baseURL:", api.defaults.baseURL);
      console.log("✅ 요청 보냄: /api/visitor", { nickname: trimmed });
      console.log("📨 visitor post 요청 보냄:", trimmed);
      try {
        const response = await api.post('/api/visitor', { nickname: trimmed });
        console.log("✅ 응답 데이터:", response.data);
        const { visitorId, isAdminViewable } = response.data;
  
        sessionStorage.setItem('nickname', trimmed);
        sessionStorage.setItem('visitorId', visitorId);
  
        if (isAdminViewable) {
          navigate('/admin');
        } else {
          navigate('/survey');
        }
      } catch (error) {
        console.error('닉네임 등록 실패:', error);
        if (error.response) {
          console.error("📛 서버 응답 상태:", error.response.status);
          console.error("📬 서버 응답 내용:", error.response.data);
        }
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
