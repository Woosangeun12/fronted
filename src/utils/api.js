import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false  // ❗ 꼭 명시
});

// 개발 중 콘솔 확인용
if (import.meta.env.DEV) {
  console.log("🔗 Axios baseURL:", API_BASE_URL);
}

export default api;
