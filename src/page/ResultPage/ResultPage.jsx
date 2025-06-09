import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

export default function ResultPage() {
  const { id } = useParams();
  const [html, setHtml] = useState("");        // HTML 문자열
  const [error, setError] = useState("");      // 에러 메시지
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const res = await api.get(`/api/html/${id}`);
        // ✅ 응답이 { html: "..." } 형태라면
        if (res.data?.html) {
          setHtml(res.data.html);
        } else {
          setHtml(res.data); // 혹시 그냥 string이면 이 fallback 사용
        }
      } catch (err) {
        console.error("결과 페이지 로딩 실패:", err);
        setError("결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="html-result-wrapper"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ padding: "2rem", backgroundColor: "#fffbe6" }}
    />
  );
}
