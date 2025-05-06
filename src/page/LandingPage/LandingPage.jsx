import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postVisitor } from "../../apis/visitor"; 
import './LandingPageSty.css';
import pxArt from "../../assets/pxArt-3_5.png";

const LandingPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname.trim()) return;

    console.log("🧾 입력한 닉네임:", nickname.trim());
    try {
      const { visitorId, isAdminViewable } = await postVisitor(nickname);
      console.log("✅ 응답 데이터:", { visitorId, isAdminViewable });

      sessionStorage.setItem('nickname', nickname.trim());
      sessionStorage.setItem('visitorId', visitorId);

      navigate(isAdminViewable ? "/admin" : "/survey");
    } catch (error) {
      console.error('❌ 닉네임 등록 실패:', error);
      if (error.response) {
        console.error("📛 서버 응답 상태:", error.response.status);
        console.error("📬 서버 응답 내용:", error.response.data);
      }
      alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
