// src/api/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 콘솔에서 확인용 (개발 환경에서만 출력)
if (import.meta.env.DEV) {
  console.log("🔗 Axios baseURL:", API_BASE_URL);
}

export default api;
