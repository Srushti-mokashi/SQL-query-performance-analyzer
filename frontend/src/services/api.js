import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

/* ================================
   QUERY SERVICES
================================ */

export const queryService = {

  // Run SQL query + log execution
  execute: async (query) => {

    const response = await api.post("/queries/analyze", {
      query: query
    });

    return response;
  },

  // Get query history
  getHistory: async (page = 1, limit = 20) => {

    const response = await api.get("/queries", {
      params: { page, limit }
    });

    return response;
  }

};

/* ================================
   ANALYTICS SERVICES
================================ */

export const analyticsService = {

  analyze: async (query) => {

    const response = await api.post("/analytics", {
      query: query
    });

    return response;
  },

  getStats: async () => {

    const response = await api.get("/analytics/stats");

    return response;
  }

};

/* ================================
   SYSTEM HEALTH
================================ */

export const systemService = {

  getHealth: async () => {

    const response = await api.get("/health");

    return response;
  }

};

export default api;