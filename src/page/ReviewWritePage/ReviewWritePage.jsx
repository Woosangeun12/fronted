import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../utils/api';
import "./ReviewWritePage.css";

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = location.state?.movieId; // ✅ movieId 받기
  const [rating, setRating] = useState(0); 
  const [review, setReview] = useState("");
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
    if (!visitorId || !movieId) {
      alert("비정상 접근입니다. 처음부터 다시 시작해주세요.");
      navigate("/");
    }
  }, [visitorId, movieId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      alert("리뷰를 작성해주세요!");
      return;
    }

    try {
      await api.post(`/api/review/submit/${visitorId}`, {
        movieId, // ✅ 추가
        score: rating,
        review: review.trim(),
      });

      alert("리뷰가 성공적으로 제출되었습니다!");
      setReview("");
      setRating(5);
      navigate("/last");
    } catch (error) {
      console.error("리뷰 제출 실패:", error);
      alert("리뷰 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSkip = () => {
    navigate("/last");
  };

  return (
    <div className="review-write-container">
      <h1 className="review-title">더 나아지는 말랑을 위해</h1>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={value <= rating ? "star filled" : "star"}
              onClick={() => setRating(value)}
            >
              ★
            </span>
          ))}
        </div>

        <label className="review-textarea-label">
          REVIEW
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            maxLength={200}
            placeholder="저희 말랑 사이트, 어땠나요? 당신의 생각을 들려주세요.  (최대 200자)"
          />
          <div className="char-count">{review.length}/200자</div>
        </label>

        <div className="review-button-group">
          <button type="submit" className="review-submit-btn">리뷰 제출하기</button>
          <button type="button" className="review-skip-btn" onClick={handleSkip}>작성 건너뛰기</button>
        </div>
      </form>
    </div>
  );
}
