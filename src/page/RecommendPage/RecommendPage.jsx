import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import api from '../../utils/api';
import "./RecommendPage.css";

export default function RecommendPage() {
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const visitorId = sessionStorage.getItem("visitorId");

  // 추천 영화 목록 불러오기
  useEffect(() => {
    if (!visitorId) {
      setMovieList(recommendedMovies); // 백엔드 미연결 시 예시 사용
      return;
    }
  
    api.get(`/api/recommend/${visitorId}`)
      .then(res => setMovieList(res.data))
      .catch(err => {
        console.error("추천 영화 불러오기 실패:", err);
        setMovieList(recommendedMovies); // 실패 시도 예시 사용
      });
  }, [visitorId]);

  // 상세 정보 조회 + 모달 열기
  const handleSelectMovie = async (movieId) => {
    try {
      const res = await api.get(`/api/recommend/info/${movieId}`);
      setSelectedMovie(res.data);
    } catch (err) {
      console.error("영화 상세 정보 불러오기 실패:", err);
    }
  };

  // 영화 선택 확정 → 리뷰 페이지 이동
  const handleConfirmSelect = () => {
    const confirm = window.confirm("정말 이 영화를 선택하시겠습니까?");
    if (confirm) {
      sessionStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
      navigate("/review", { state: { movieId: selectedMovie.id } });
    }
  };

  return (
    <div className="recommend-container">
      <h1 className="title">🎬 당신을 위한 영화 추천</h1>

      <div className="movie-grid">
        {movieList.map((movie, index) => (
          <div
          key={index}
          className="movie-card"
          onClick={() =>
            visitorId ? handleSelectMovie(movie.id) : setSelectedMovie(movie)
          }
          >
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-info">{movie.year} · {movie.hour}</p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selectedMovie && (
        <div className="fullscreen-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-wrapper">
              <img
                src={selectedMovie.image}
                alt={selectedMovie.title}
                className="modal-movie-image"
              />
              <div className="modal-image-overlay">
                <div className="modal-overlay-text">
                  <h2>{selectedMovie.title}</h2>
                  <p>{selectedMovie.year} · {selectedMovie.genre} · {selectedMovie.hour}</p>
                </div>
              </div>
            </div>

            <div className="modal-movie-info">
              <p><strong>감독:</strong> {selectedMovie.director}</p>
              <p><strong>주연배우:</strong> {selectedMovie.actor1}, {selectedMovie.actor2}</p>
              <p><strong>국가:</strong> {selectedMovie.origin}</p>
              <p><strong>평점:</strong> {selectedMovie.score}</p>

              <div className="modal-summary-box">
                <p>{selectedMovie.summary}</p>
              </div>

              <button className="select-button" onClick={handleConfirmSelect}>선택하기 ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
