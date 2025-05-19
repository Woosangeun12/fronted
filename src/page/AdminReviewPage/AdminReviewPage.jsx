import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [visitorStats, setVisitorStats] = useState({ totalCount: 0, todayCount: 0 });
  const [page, setPage] = useState(0); // 현재 페이지
  const [pageSize] = useState(10);     // 페이지당 개수

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= Math.ceil(totalCount / pageSize)) return;
    setPage(newPage);
  };
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewRes, visitorRes] = await Promise.all([
          api.get(`/api/review/list?page=${page}&size=${pageSize}`),
          api.get('/api/admin/visitors/count')
        ]);
        setReviews(reviewRes.data.reviews);              // ✅
        setTotalCount(reviewRes.data.totalCount);        // ✅
        setAverageScore(reviewRes.data.averageScore);    // ✅

        setVisitorStats({
          totalCount: visitorRes.data.totalCount,
          todayCount: visitorRes.data.todayCount,
        });
      } catch (error) {
        console.error('리뷰 불러오기 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="admin-review-container" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>리뷰 목록</h2>

      <div className="review-stats">
        <div><strong>총 사용자 수:</strong> 👥 {visitorStats.totalCount}명</div>
        <div><strong>오늘 방문:</strong> 🚶 {visitorStats.todayCount}명</div>
      </div>
      <div className="review-stats">
        <div><strong>총 리뷰 수:</strong> 📝 {totalCount}개</div>
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

      <div className="pagination" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          ◀ 이전
        </button>
        <span>페이지 {page + 1} / {Math.ceil(totalCount / pageSize)}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={(page + 1) * pageSize >= totalCount}>
          다음 ▶
        </button>
      </div>
    </div>
  );
};

export default AdminReviewPage;
