// axios 인스턴스 만들기
import axios from 'axios';

const LOCAL_BACKEND = import.meta.env.VITE_APP_BACKEND; // vite 기준

const api = axios.create({
  baseURL: LOCAL_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청마다 토큰 추가 등 인터셉터도 가능
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
