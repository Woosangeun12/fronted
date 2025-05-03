import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/api/review/list?page=0&size=10');
        setReviews(response.data.reviews);              // ✅ 리뷰 배열
        setTotalCount(response.data.totalCount);        // ✅ 총 리뷰 수
        setAverageScore(response.data.averageScore);    // ✅ 평균 평점
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
    <div className="admin-review-container" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>리뷰 목록</h2>

      {/* ✅ 통계 UI */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '500px'
      }}>
        <div><strong>총 리뷰 수:</strong> {totalCount}개</div>
        <div><strong>평균 평점:</strong> ⭐ {averageScore.toFixed(1)}</div>
      </div>

      {/* ✅ 리뷰 테이블 */}
      {reviews.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <table className="review-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>닉네임</th>
              <th>평점</th>
              <th>리뷰</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index}>
                <td>{review.nickname}</td>
                <td>{review.score}</td>
                <td>{review.review}</td>
                <td>{review.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewPage;
