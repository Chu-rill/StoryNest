import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://nspire-backend.vercel.app';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
client.interceptors.request.use(
  (config) => {
    // Check if token exists in cookies
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      // Clear cookies and potentially redirect to login
      Cookies.remove('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;