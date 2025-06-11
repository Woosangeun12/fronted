import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import { useNavigate } from "react-router-dom"; 
import "./QuotePage.css";
import bike from "../../assets/bike.PNG";
import book from "../../assets/book.PNG";
import cake from "../../assets/cake.PNG";
import heart from "../../assets/heart.PNG"; 
import hug from "../../assets/hug.PNG"; 
import luck from "../../assets/luck.PNG"; 
import talk from "../../assets/talk.PNG"; 
import pxArt from '../../assets/pxArt-3_5.png';

export default function QuotePage() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [tone, setTone] = useState("");
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const images = [bike, book, cake, heart, hug, luck, talk];

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
    const storedTone = sessionStorage.getItem("tone");
    const storedEmotion = sessionStorage.getItem("emotion");
    const style = sessionStorage.getItem("style");

    if (storedTone) setTone(storedTone);
    setImage(images[Math.floor(Math.random() * images.length)]); // 랜덤 이미지

    if (!storedEmotion || !style || !storedTone) {
      setQuote("필요한 감정 정보가 부족해요");
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const res = await api.post("/api/mental/message", {
          emotion: storedEmotion,
          style,
          tone: storedTone,
        });

        if (res.data?.content) {
          setQuote(res.data.content);
        } else {
          setQuote("오늘의 한마디가 없습니다.");
        }
      } catch (err) {
        console.error("한마디 요청 실패:", err);
        setQuote("오늘의 한마디를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  // sessionStorage에서 영화,마음처방전 데이터 불러오기
  useEffect(() => {
    const movieData = sessionStorage.getItem("selectedMovie");

    if (movieData) {
      setSelectedMovie(JSON.parse(movieData));
    }
  }, []);

  const generateHtml = () => {
    if (!selectedMovie) return "";
    const sanitizedQuote = quote.replace(/"/g, '&quot;');

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${selectedMovie.title}</title>
  <style>
     @font-face {
      font-family: 'Ownglyph_meetme-Rg';
      src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_1@1.0/Ownglyph_meetme-Rg.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    body { font-family: sans-serif; background: #fffbe6; padding: 3rem; }
    img { width: 100%; max-width: 480px; border-radius: 17px; display: block; margin: 0 auto; height: 550px; margin-bottom: 1rem; }
    .quote--container { width: 700px; background-color: #fffbe6; display: flex; flex-direction: column;
                        align-items: center; padding: 3rem 1.5rem; box-sizing: border-box;}
    .quote { font-weight: 700; font-size: 4.5rem; margin-top: 1rem; color: #444;  text-align: center; font-family: 'Ownglyph_meetme-Rg', sans-serif;}
    .movie-info { font-weight: bold; margin-top: 1.5rem; font-size: 6.5rem; color: #333; text-align: center; font-family: 'Ownglyph_meetme-Rg', sans-serif;}
     @media (max-width: 480px) {
      body {
        padding: 1rem;
      }

      .quote--container {
        padding: 1.5rem 1rem;
      }

      .movie-info {
        font-size: 2rem;
      }

      .quote {
        font-size: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class ="quote--container">
    <img src="${selectedMovie.image}" alt="${selectedMovie.title}" />
    <div class="movie-info">
      <p>${selectedMovie.title}</p>
    </div>
    <p class="quote">${sanitizedQuote}</p>
  </div>
</body>
</html>
    `;
  };
  //카카오톡 sdk 재설정
  const handleKakaoShare = async () => {
    const html = generateHtml();
  
    if (!html) {
      alert("영화 데이터가 없습니다.");
      return;
    }
  
    try {
      const res = await api.post('/api/html/save', { html });
      const rawUrl = res.data.url; 
  
      console.log("✅ 최종 공유 링크:", rawUrl);
  
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: "내 감정에 맞춘 영화, 너도 한번 볼래?",
          description: "친구가 추천받은 영화와 감정 진단 결과를 확인해보세요!",
          imageUrl: selectedMovie.image,
          link: {
            mobileWebUrl: rawUrl,
            webUrl: rawUrl,
          },
        },
        buttons: [
          {
            title: '결과 보러가기',
            link: {
              mobileWebUrl: rawUrl,
              webUrl: rawUrl,
            },
          },
        ],
      });
    } catch (err) {
      console.error("카카오 공유 실패:", err);
      alert("공유에 실패했습니다.");
    }
  };
  
  //확인
  useEffect(() => {
    if (window.Kakao) {
      if (window.Kakao.isInitialized()) {
        window.Kakao.cleanup(); // 🔧 기존 초기화된 Kakao 인스턴스 제거
      }
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY); // 재초기화
    }
  }, []);
  
  if (!selectedMovie) return <div>로딩 중...</div>;

  return (
    <div className="quote-container">
      <h1 className="quote-title">
        당신의 감정을 읽고, <br />
        AI가 건네는 마음 처방전 🌿💌
      </h1>

      <div className="quote-card">
        {image && (
          <img
            src={image}
            alt="처방 이미지"
            className="emotion-image"
          />
        )}
        <p className="quote-text fade-in">
          {loading ? "AI가 당신의 마음에 꼭 맞는 처방을 찾고 있어요" : `"${quote}"`}
        </p>
      </div>
      <div className="button-group">
        <button
          type="button"
          className="submit-btn"
          onClick={() => navigate("/reviewwrite", { state: { movieId: selectedMovie.movieId } })}
        >
          리뷰 작성하기
        </button>
      </div>
      <div>
      <button className="lastpage-button" onClick={handleKakaoShare}>
        내 마음 카카오톡으로 공유하기
      </button>
      </div>
    </div>
  );
}
