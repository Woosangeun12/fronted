import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import api from '../../utils/api';
import "./RecommendPage.css";

const recommendedMovies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    hour: "148분",
    genre: "SF, 스릴러",
    description: "꿈 속의 꿈, 그리고 또 하나의 꿈. 놀란 감독의 SF 스릴러.",
    image: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    summary: "도둑이 타인의 꿈에 침입해 정보를 훔치는 미래. 주인공 코브는 마지막 임무를 맡게 된다.",
    score: "9.1",
    director: "크리스토퍼 놀란",
    actor1: "레오나르도 디카프리오",
    actor2 : "조셉 고든 레빗",
    origin: "미국",
  },
  {
    id: 2,
    title: "La La Land",
    year: 2016,
    hour: "128분",
    genre: "로맨스, 음악",
    description: "꿈을 쫓는 두 남녀의 사랑과 음악이 어우러진 감성 영화.",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    summary: "재즈 피아니스트와 배우 지망생이 LA에서 만나 꿈과 사랑을 키워간다.",
    score: "8.5",
    director: "데이미언 셔젤",
    actor1: "라이언 고슬링",
    actor2: "엠마 스톤",
    origin: "미국",
  },
  {
    id: 3,
    title: "Parasite",
    year: 2019,
    hour: "132분",
    genre: "드라마, 스릴러",
    description: "봉준호 감독의 사회 풍자 스릴러. 아카데미 4관왕 수상작.",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    summary: "가난한 가족이 부잣집에 하나씩 잠입하며 벌어지는 이야기.",
    score: "9.3",
    director: "봉준호",
    actor1: "송강호",
    actor2: "최우식",
    origin: "대한민국",
  },
];

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
  
    axios.get(`/api/recommend/${visitorId}`)
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
