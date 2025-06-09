import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LastPage.css';
import pxArt from '../../assets/pxArt-3_5.png';
import api from '../../utils/api'; // axios 인스턴스

export default function LastPage() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [quote, setQuote] = useState("");
  const html = generateHtml();

  // sessionStorage에서 영화,마음처방전 데이터 불러오기
  useEffect(() => {
    const movieData = sessionStorage.getItem("selectedMovie");
    const quoteData = sessionStorage.getItem("quote");

    if (movieData) {
      setSelectedMovie(JSON.parse(movieData));
    }

    if (quoteData) {
      setQuote(quoteData);
    }
  }, []);

  const generateHtml = () => {
    if (!selectedMovie) return "";

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${selectedMovie.title}</title>
  <style>
    body { font-family: sans-serif; background: #fffbe6; padding: 2rem; }
    img { width: 100%; max-width: 300px; border-radius: 10px; display: block; margin-bottom: 1rem; }
    .quote { font-style: italic; font-size: 1.5rem; margin-top: 1rem; color: #444; }
    .movie-info { margin-top: 1rem; font-size: 1rem; color: #333; }
  </style>
</head>
<body>
  <img src="${selectedMovie.image}" alt="${selectedMovie.title}" />
  <div class="movie-info">
    <p>${selectedMovie.title}</p>
  </div>
  <p class="quote">"${quote}"</p>
</body>
</html>
    `;
  };

  const handleKakaoShare = async () => {
    console.log("[카카오 공유] 보낼 HTML 내용:", html);
    try {
      const html = generateHtml();
      if (!html) return alert("영화 데이터가 없습니다.");

      const res = await api.post('/api/html/save', { html });
      const sharedUrl = res.data.url;

      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: `${selectedMovie.title} 🎬`,
          description: `"${quote}"`,
          imageUrl: selectedMovie.image,
          link: {
            mobileWebUrl: sharedUrl,
            webUrl: sharedUrl,
          },
        },
        buttons: [
          {
            title: '결과 보러가기',
            link: {
              mobileWebUrl: sharedUrl,
              webUrl: sharedUrl,
            },
          },
        ],
      });
    } catch (err) {
      console.error("카카오 공유 실패:", err);
      alert("공유에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  if (!selectedMovie) return <div>로딩 중...</div>;

  return (
    <div className="lastpage-container">
      <img src={pxArt} alt="pixel art" className="lastpage-image" />
      <p className="lastpage-message">
        감사합니다,<br />
        앞으로 더 노력하는 말랑이가 되겠습니다.
      </p>
      <button className="lastpage-button" onClick={() => navigate('/')}>
        처음으로
      </button>
      <button className="lastpage-button" onClick={handleKakaoShare}>
        카카오톡으로 공유하기
      </button>
    </div>
  );
}
