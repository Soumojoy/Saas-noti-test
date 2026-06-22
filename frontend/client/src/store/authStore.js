// frontend/src/store/authStore.js
import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
  // Refresh hone par user ka data localStorage se parse karke nikalenge
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Token aur User dono ko localStorage mein save karo
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed', isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      
      // Token aur User dono ko localStorage mein save karo
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    // Logout par sab saaf kar do
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;