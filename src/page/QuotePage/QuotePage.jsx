import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import { useNavigate } from "react-router-dom"; 
import "./QuotePage.css";

// 감정별 이미지
import Relax from "../../assets/Relax.png";
//import CheerUp from "../../assets/CheerUp.png";

// 감정 → 이미지 매핑
const emotionImageMap = {
  위로: Relax,
  //동기부여: CheerUp,
  조언: Advise,
};

export default function QuotePage() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [tone, setTone] = useState("");
  const navigate = useNavigate();

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
    const stored = sessionStorage.getItem("selectedMovie");
    if (stored) {
      setMovie(JSON.parse(stored));
    }

    const storedTone = sessionStorage.getItem("tone");
    if (storedTone) {
      setTone(storedTone);
    }

    const fetchQuote = async () => {
      const style = sessionStorage.getItem("style");
      const tone = sessionStorage.getItem("tone");

      console.log("보내는 요청:", { emotion: storedEmotion, style, tone });
  
      if (!storedEmotion || !style || !tone) {
        setQuote("필요한 감정 정보가 부족해요.");
        setLoading(false);
        return;
      }
  
      try {
        const res = await api.post("/api/mental/message", {
          emotion: storedEmotion,
          style,
          tone,
        });
  
        if (res.data && res.data.message) {
          setQuote(res.data.message);
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

  return (
    <div className="quote-container">
      <h1 className="quote-title">
        당신의 감정을 읽고, <br />
        AI가 건네는 마음 처방전 🌿💌
      </h1>

      <div className="quote-card">
        {tone && (
          <img
            src={emotionImageMap[tone.trim()]}
            alt={tone}
            className="emotion-image"
          />
        )}
        <p className="quote-text fade-in">
          {loading ? "AI가 당신의 마음에 꼭 맞는 처방을 찾고 있어요" : `"${quote}"`}
        </p>
      </div>

      {movie?.movieId && (
        <div className="button-group">
          <button
            type="button"
            className="submit-btn"
            onClick={() => navigate("/reviewwrite", { state: { movieId: movie.movieId } })}
          >
            리뷰 작성하기
          </button>
        </div>
      )}
    </div>
  );
}
