import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queryService = {
  execute: (query) => api.post('/queries/execute', { query }),
  getHistory: (page = 1, limit = 20) => api.get(`/queries/history?page=${page}&limit=${limit}`),
};

export const analyticsService = {
  analyze: (query) => api.post('/analytics', { query }),
  getStats: () => api.get('/analytics/stats'),
};

export const systemService = {
  getHealth: () => api.get('/health'),
};

export default api;
