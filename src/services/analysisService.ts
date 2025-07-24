import { AnalysisFilters, AnalysisResult, PaginatedResponse, PullRequestNode } from '../types/analysis';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085/api';

export const getAnalyses = async (filters: AnalysisFilters): Promise<PaginatedResponse<AnalysisResult>> => {
  const response = await fetch(
    `${API_URL}/analyses?page=${filters.page}&size=${filters.size}${
      filters.repositoryName ? `&repositoryName=${filters.repositoryName}` : ''
    }`
  );
  return response.json();
};

export const getContextGraph = async (repoId: number, branch?: string): Promise<PullRequestNode[]> => {
  debugger;
  const url = branch 
    ? `${API_URL}/context-graph/${repoId}/${branch}`
    : `${API_URL}/context-graph/${repoId}`;
  const response = await fetch(url);
  return response.json();
}; 