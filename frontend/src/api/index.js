import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api'; // replace with your backend URL

// Create axios instance with auth header if token exists
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
