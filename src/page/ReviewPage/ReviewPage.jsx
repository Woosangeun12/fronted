import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./ReviewPage.css";

export default function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = location.state?.movieId;
  const [movie, setMovie] = useState(null); // ✅ 상태 선언

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
  
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
  
    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);  

  useEffect(() => {
    if (!movieId) return;
  
    api.post(`/api/recommend/info/${movieId}`, {})
      .then((res) => setMovie(res.data))
      .catch((err) => console.error("영화 정보 로딩 실패", err));
  }, [movieId]);
  
  if (!movie) return <div className="review-container">로딩 중...</div>; // ✅ null 체크

  return (
    <div className="review-container">
      <h1 className="review-title">{movie.title}</h1>

      <div className="review-card">
        <img src={movie.image} alt={movie.title} className="review-image" />
        <div className="review-info">
          <p><strong>감독:</strong> {movie.director}</p>
          <p><strong>장르:</strong> {movie.genre}</p>
          <p><strong>출연:</strong> {movie.actor1}, {movie.actor2}</p>
          <p><strong>국가:</strong> {movie.origin}</p>
          <p><strong>상영시간:</strong> {movie.hour}</p>
          <p className="summary">{movie.summary}</p>
        </div>
      </div>

      <div className="button-group">
        <button
          type="button"
          className="submit-btn"
          onClick={() => navigate("/quote")}
        >
          나에게 맞는 AI 감정 처방 받기
        </button>
        <p className="button-description">AI가 당신의 마음을 분석하고 알려줍니다</p>
      </div>
    </div>
  );
}
