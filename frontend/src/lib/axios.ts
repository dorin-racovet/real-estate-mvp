import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if there was a token (i.e., user was authenticated)
    // Don't redirect on login page itself when credentials are invalid
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      
      // Only redirect if user had a token (authenticated session expired)
      if (hadToken && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;