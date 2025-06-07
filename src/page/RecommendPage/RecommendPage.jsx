import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import api from '../../utils/api';
import "./RecommendPage.css";

export default function RecommendPage() {
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const visitorId = sessionStorage.getItem("visitorId");

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
    const stored = sessionStorage.getItem("recommendedMovies");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTimeout(() => {
        console.log("✅ 추천 영화 목록:", parsed);
      }, 100); 
      setMovieList(parsed);
    } else {
      alert("추천 데이터가 없습니다. 설문을 먼저 완료해 주세요.");
      navigate("/survey");
    }
  }, []);
  

  const handleSelectMovie = async (movie) => {
    try {
      const res = await api.post(`/api/recommend/info/${movie.movieId}`, {});
      // movieId 수동 삽입
      setSelectedMovie({
        ...res.data,
        movieId: movie.movieId
      });
    } catch (err) {
      console.error("영화 상세 정보 불러오기 실패:", err);
    }
  };
  
  

  const handleConfirmSelect = () => {
    console.log("🧪 handleConfirmSelect 호출됨", selectedMovie);
  
    if (!selectedMovie) {
      console.warn("❗ selectedMovie가 비어있음");
      return;
    }
  
    sessionStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
    console.log("선택한 영화:", selectedMovie);
    console.log("넘기는 movieId:", selectedMovie.movieId);
    navigate("/review", { state: { movieId: selectedMovie.movieId } });
  };

  

  return (
    <>
      <div className="recommend-container">
        <h1 className="title">🎬 당신의 오늘 어떤 영화와 닮아 있을까요</h1>
        <p className="movie-subtitle">영화 중 한 개를 선택해주세요!</p>
        
        <div className="movie-grid">
          {movieList.map((movie, index) => (
            <div
              key={movie.movieId}
              className="movie-card"
              onClick={() => handleSelectMovie(movie)}
            >
              <img src={movie.image} alt={movie.title} className="movie-image" />
              <h2 className="movie-title">{movie.title}</h2>
              <p className="movie-info">{movie.year.toString().slice(0,4)} · {movie.hour}분</p>
            </div>
          ))}
        </div>
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
                  <p>{selectedMovie.year.toString().slice(0,4)} · {selectedMovie.genre} · {selectedMovie.hour}분</p>
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
    </>
  );
}  
