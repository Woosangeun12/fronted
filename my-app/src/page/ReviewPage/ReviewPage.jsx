import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import "./ReviewPage.css";

export default function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  if (!movie) {
    // 영화 정보 없이 들어오면 에러 방지
    return (
      <div className="review-container">
        <h2>영화 정보를 불러올 수 없습니다. 다시 추천받아주세요.</h2>
        <button onClick={() => navigate("/recommend")} className="submit-btn">
          추천 페이지로 돌아가기
        </button>
      </div>
    );
  }

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
          onClick={() => navigate("/reviewwrite")}
        >
          리뷰 작성하기
        </button>
        <button
          type="button"
          className="skip-btn"
          onClick={() => navigate("/quote")}
        >
          마음 한조각으로 가기
        </button>
      </div>
    </div>
  );
}

