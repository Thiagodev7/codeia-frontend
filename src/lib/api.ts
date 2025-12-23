import axios from 'axios';

// Usa variável de ambiente do Vite ou fallback para localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Evita loop de redirecionamento se já estiver no login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('codeia_token');
        localStorage.removeItem('codeia_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);