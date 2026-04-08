import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   Query Services
================================ */

export const queryService = {
  // Execute query and log performance
  execute: (query) =>
    api.post("/queries/analyze", {
      query,
    }),

  // Get query history
  getHistory: (page = 1, limit = 20) =>
    api.get("/queries", {
      params: { page, limit },
    }),
};

/* ================================
   Analytics Services
================================ */

export const analyticsService = {
  // Analyze query performance
  analyze: (query) =>
    api.post("/analytics", {
      query,
    }),

  // Get dashboard statistics
  getStats: () => api.get("/analytics/stats"),
};

/* ================================
   System Health Services
================================ */

export const systemService = {
  getHealth: () => api.get("/health"),
};

export default api;