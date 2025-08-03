import { 
  AnalysisFilters, 
  AnalysisResult, 
  PaginatedResponse, 
  PullRequestNode,
} from '../types/analysis';
import { decodeJwt } from '../utils/jwt';
import apiClient from './apiClient';

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
    const response = await apiClient.get<PullRequestNode[]>(`/pull-request/user/${decoded.sub}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch pull request nodes');
  }
};

export const getAnalyses = async (filters: AnalysisFilters): Promise<PaginatedResponse<AnalysisResult>> => {
  const response = await apiClient.get<PaginatedResponse<AnalysisResult>>(
    `/analyze/${filters.page}/${filters.size}`
  );
  return response.data;
};

export const getContextGraph = async (repoId: number, branch?: string): Promise<PullRequestNode[]> => {
  const url = branch 
    ? `/pull-request/repo/${repoId}/${branch}`
    : `/pull-request/repo/${repoId}`;
  const response = await apiClient.get<PullRequestNode[]>(url);
  return Array.isArray(response.data) ? response.data : [response.data];
};

export const getPullRequestNodeById = async (id: number): Promise<PullRequestNode> => {
  try {
    const response = await apiClient.get<PullRequestNode>(`/pull-request/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch pull request node');
  }
};

export const getUserPullRequestNodes = async (username: string): Promise<PullRequestNode[]> => {
  try {
    const response = await apiClient.get<PullRequestNode[]>(`/pull-request/user/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch user pull request nodes');
  }
};