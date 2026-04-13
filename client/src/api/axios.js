import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Debug: Log the API URL to console
console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL.includes("/api") ? API_URL : `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auto-logout on unauthorized sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      // Force redirect to login on token expiration or invalidity
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
