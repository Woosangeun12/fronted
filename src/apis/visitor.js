// src/apis/visitor.js
import api from '../utils/api';

export const postVisitor = async (nickname) => {
  const trimmed = nickname.trim();
  const response = await api.post('/api/visitor', { nickname: trimmed });
  return response.data;
};
