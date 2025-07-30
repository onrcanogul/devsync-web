import { 
  AnalysisFilters, 
  AnalysisResult, 
  PaginatedResponse, 
  PullRequestNode,
  DashboardData
} from '../types/analysis';
import { decodeJwt } from '../utils/jwt';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085/api';

export const getPullRequestNodes = async (): Promise<PullRequestNode[]> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const decoded = decodeJwt(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  try {
    const response = await axios.get<PullRequestNode[]>(`http://localhost:8085/api/context-graph/user/${decoded.sub}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pull request nodes');
    }
    throw error;
  }
};

export const getAnalyses = async (filters: AnalysisFilters): Promise<PaginatedResponse<AnalysisResult>> => {
  const response = await fetch(
    `${API_URL}/analyses?page=${filters.page}&size=${filters.size}${
      filters.repositoryName ? `&repositoryName=${filters.repositoryName}` : ''
    }`
  );
  return response.json();
};

export const getContextGraph = async (repoId: number, branch?: string): Promise<PullRequestNode[]> => {
  const url = branch 
    ? `${API_URL}/context-graph/${repoId}/${branch}`
    : `${API_URL}/context-graph/${repoId}`;
  const response = await fetch(url);
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

export const getPullRequestNodeById = async (id: number): Promise<PullRequestNode> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get<PullRequestNode>(`http://localhost:8085/api/context-graph/pull-request/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pull request node');
    }
    throw error;
  }
};

export const getUserPullRequestNodes = async (username: string): Promise<PullRequestNode[]> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get<PullRequestNode[]>(`http://localhost:8085/api/context-graph/user/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user pull request nodes');
    }
    throw error;
  }
};