import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

if (!GITHUB_CLIENT_ID) {
  throw new Error('GitHub Client ID is not configured. Please set REACT_APP_GITHUB_CLIENT_ID in your environment variables.');
}

export const authService = {
  getGitHubOAuthURL: () => {
    // GitHub'da kayıtlı olan callback URL'i kullan
    const redirectUri = encodeURIComponent('http://localhost:3000/oauth/callback');
    const scope = 'read:user user:email';
    
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  },

  handleGitHubCallback: async (code: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/github/code`, { code });
      const { token } = response.data;
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('auth_token', token);
      
      // Axios için default header'ı ayarla
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return token;
    } catch (error) {
      console.error('GitHub login error:', error);
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

  logout: () => {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
  },
}; 