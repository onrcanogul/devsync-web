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

// Request interceptor to add auth token to all requests and check expiration
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Token varsa expire olup olmadığını kontrol et
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

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized hatası gelirse
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

export default apiClient;