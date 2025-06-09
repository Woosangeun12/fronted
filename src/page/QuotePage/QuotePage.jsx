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

export default function QuotePage() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [tone, setTone] = useState("");
  const navigate = useNavigate();

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

        if (res.data?.message) {
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
          onClick={() => navigate("/reviewwrite")}
        >
          리뷰 작성하기
        </button>
      </div>
    </div>
  );
}
