import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postVisitor } from "../../apis/visitor"; 
import './LandingPageSty.css';
import pxArt from "../../assets/pxArt-3_5.png";

const LandingPage = () => {  // ✅ 함수 선언 시작
  const [nickname, setNickname] = useState('');
  const [showNotice, setShowNotice] = useState(true); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) return;

    console.log("🧾 입력한 닉네임:", trimmedNickname);

    if (trimmedNickname === "Admin1") {
      sessionStorage.setItem("nickname", trimmedNickname);
      sessionStorage.setItem("visitorId", "admin-skip");
      navigate("/admin");
      return;
    }

    try {
      const { visitorId, isAdminViewable } = await postVisitor(trimmedNickname);
      console.log("✅ 응답 데이터:", { visitorId, isAdminViewable });

      sessionStorage.setItem('nickname', trimmedNickname);
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

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-container">
      <img src={pxArt} alt="달과 구름" className="landing-image" />

      {showNotice && (
        <p className="landing-notice">
          해당 닉네임은 일회성으로 사용되며, 개인정보는 저장되지 않습니다.
        </p>
      )}

      <form onSubmit={handleSubmit} className="landing-form">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요"
          className="landing-input"
        />
        <button type="submit" className="landing-button">시작하기</button>
      </form>
    </div>
  );
};

export default LandingPage;
