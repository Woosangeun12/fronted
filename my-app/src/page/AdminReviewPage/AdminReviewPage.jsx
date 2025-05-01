import React, { useEffect, useState } from 'react';


const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 비동기 함수 정의
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews'); // 실제 API 경로로 수정 필요
        if (!response.ok) throw new Error('데이터 불러오기 실패');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('리뷰 불러오기 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="admin-review-container">
      <h2>리뷰 목록</h2>
      {reviews.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>평점</th>
              <th>코멘트</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewPage;
