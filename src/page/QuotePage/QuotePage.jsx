import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import "./QuotePage.css";

export default function QuotePage() {
  const movie = {
    title: "La La Land",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  };

  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.post("/api/mental/message", {
          emotion: "위로",
          style: "감성적",
          tone: "부드러움"
        });

        if (response.data && response.data.message) {
          setQuote(response.data.message);
        } else {
          setQuote("오늘의 한마디가 없습니다.");
        }
      } catch (error) {
        console.error("한마디 요청 실패:", error);
        setQuote("오늘의 한마디를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="quote-container">
      <h1 className="quote-title">마음 처방전</h1>

      <div className="quote-card">
        <img
          src={movie.image}
          alt={movie.title}
          className="quote-image"
        />
        <div className="quote-movie-title">{movie.title}</div>
        <p className="quote-text fade-in">
          {loading ? "로딩 중..." : `"${quote}"`}
        </p>
      </div>
    </div>
  );
}
