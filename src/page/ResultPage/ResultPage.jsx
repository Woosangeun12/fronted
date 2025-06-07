import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

export default function ResultPage() {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/html/${id}`)
      .then((res) => setHtml(res.data))
      .catch(() => setError("결과를 불러오지 못했습니다."));
  }, [id]);

  if (error) return <p>{error}</p>;

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
