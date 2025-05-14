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
      navigate("/quote");
    } catch (error) {
      console.error("리뷰 제출 실패:", error);
      alert("리뷰 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSkip = () => {
    navigate("/quote");
  };

  return (
    <div className="review-write-container">
      <h1 className="review-title">리뷰 작성</h1>

      <form className="review-form" onSubmit={handleSubmit}>
        <label>평점 선택</label>
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
          📝 리뷰 작성
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            maxLength={200}
            placeholder="저희 말랑 사이트, 어땠나요? 당신의 생각을 들려주세요.  (최대 200자)"
          />
          <div className="char-count">{review.length}/200자</div>
        </label>

        <div className="button-group">
          <button type="submit" className="submit-btn">
            <span className="btn-text">리뷰 제출하기</span>
          </button>
          <button type="button" className="skip-btn" onClick={handleSkip}>
            <span className="btn-text">작성 건너뛰기</span>
          </button>
        </div>
      </form>
    </div>
  );
}
