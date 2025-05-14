import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import "./QuotePage.css";

export default function QuotePage() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);

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
  
    const fetchQuote = async () => {
      const emotion = sessionStorage.getItem("emotion");
      const style = sessionStorage.getItem("style");
      const tone = sessionStorage.getItem("tone");

      console.log("보내는 요청:", { emotion, style, tone });
  
      if (!emotion || !style || !tone) {
        setQuote("필요한 감정 정보가 부족해요.");
        setLoading(false);
        return;
      }
  
      try {
        const res = await api.post("/api/mental/message", {
          emotion,
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
        {movie && (
          <>
            <img
              src={
                movie.image?.startsWith("http")
                  ? movie.image
                  : `https://mallang.info/images/${encodeURIComponent(movie.image)}`
              }
              alt={movie.title}
              className="quote-image"
            />
            <div className="quote-movie-title">{movie.title}</div>
          </>
        )}
        <p className="quote-text fade-in">
          {loading ? "AI가 당신의 마음에 꼭 맞는 처방을 찾고 있어요" : `"${quote}"`}
        </p>
      </div>
    </div>
  );
}
