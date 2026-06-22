// frontend/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ubiquitous-chainsaw-5gxjv4jr44pqcjw7-5000.app.github.dev/api', // Backend URL
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