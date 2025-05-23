import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Only redirect if this was an authenticated request
      const wasAuthenticatedRequest = error.config?.headers?.Authorization;
      if (wasAuthenticatedRequest) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
