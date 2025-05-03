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
    if (!movieId) return;

    api.get(`/api/movie/${movieId}`)
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
          onClick={() => navigate("/reviewwrite", { state: { movieId } })}
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
