import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './AdminReviewPage.css';

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [visitorStats, setVisitorStats] = useState({ totalCount: 0, todayCount: 0 });
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewRes, visitorRes] = await Promise.all([
          api.get(`/api/review/list?page=${page}&size=${pageSize}`),
          api.get('/api/admin/visitors/count')
        ]);
        setReviews(reviewRes.data.reviews);
        setTotalCount(reviewRes.data.totalCount);
        setAverageScore(reviewRes.data.averageScore);
        setVisitorStats({
          totalCount: visitorRes.data.totalCount,
          todayCount: visitorRes.data.todayCount,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= Math.ceil(totalCount / pageSize)) return;
    setPage(newPage);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Review Admin</h1>
        <div className="dashboard-stats">
          <span>👥 {visitorStats.totalCount}명</span>
          <span>🚶 {visitorStats.todayCount}명</span>
          <span>📝 {totalCount}개</span>
          <span>⭐ {averageScore.toFixed(1)}</span>
        </div>
      </header>

      <section className="dashboard-filter">
        <input type="text" placeholder="닉네임 검색" />
        <select>
          <option>전체 평점</option>
          <option>★ 5점</option>
          <option>★ 4점 이상</option>
        </select>
        <button className="refresh-btn">🔄 새로고침</button>
      </section>

      <section className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>닉네임</th>
              <th>평점</th>
              <th>리뷰</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, idx) => (
              <tr key={idx}>
                <td>{r.nickname}</td>
                <td>{r.score}</td>
                <td>{r.review}</td>
                <td>{r.createdDate}</td>
                <td><button className="table-btn">삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="dashboard-pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>이전</button>
        <span>{page + 1} / {Math.ceil(totalCount / pageSize)}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={(page + 1) * pageSize >= totalCount}>다음</button>
      </footer>
    </div>
  );
};

export default AdminReviewPage;
