import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
});

const handleTokenExpiration = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('github_access_token');
  window.location.href = '/login';
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      if (isTokenExpired(token)) {
        handleTokenExpiration();
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

export default apiClient;