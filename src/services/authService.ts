import axios from 'axios';
import { decodeJwt } from '../utils/jwt';

const API_URL = process.env.REACT_APP_API_URL;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

if (!GITHUB_CLIENT_ID) {
  throw new Error('GitHub Client ID is not configured. Please set REACT_APP_GITHUB_CLIENT_ID in your environment variables.');
}

export interface CurrentUser {
  username: string;
  githubId: string;
  email: string;
  avatarUrl: string;
}

export const authService = {
  getGitHubOAuthURL: () => {
    const redirectUri = `https://devsyncweb.site/oauth/callback`;
    const scope = 'read:user user:email repo admin:repo_hook';
    
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
    console.log('GitHub OAuth URL:', url);
    return url;
  },

  handleGitHubCallback: async (code: string) => {
    try {
      console.log('Sending code to backend:', code);
      console.log('Backend URL:', `${API_URL}/api/auth/github/code`);
      
      const response = await axios.post(`${API_URL}/api/auth/github/code`, { code });
      console.log('Backend response:', response.data);
      
      const { token, githubAccessToken } = response.data;
      
      // Token'ları localStorage'a kaydet
      localStorage.setItem('auth_token', token);
      localStorage.setItem('github_access_token', githubAccessToken);
      
      // Axios için default header'ı ayarla
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('GitHub login error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      } else {
        console.error('GitHub login error:', error);
      }
      throw error;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  getGitHubAccessToken: () => {
    return localStorage.getItem('github_access_token');
  },

  getCurrentUser: (): CurrentUser | null => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const decoded = decodeJwt(token);
    if (!decoded) return null;

    return {
      username: decoded.sub,
      githubId: decoded.githubId,
      email: decoded.email,
      avatarUrl: decoded.avatarUrl || `https://avatars.githubusercontent.com/u/${decoded.githubId}`
    };
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('github_access_token');
    delete axios.defaults.headers.common['Authorization'];
  },
}; 