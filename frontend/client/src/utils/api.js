// frontend/src/utils/api.js
import axios from 'axios';

// Detect if running locally or in codespaces
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const devBaseUrl = 'http://localhost:5000/api';
const codespaceBaseUrl = 'https://ubiquitous-chainsaw-5gxjv4jr44pqcjw7-5000.app.github.dev/api';

const api = axios.create({
  baseURL: isLocal ? devBaseUrl : codespaceBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;