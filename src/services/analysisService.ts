import { AnalysisFilters, AnalysisResult, PaginatedResponse, PullRequestNode } from '../types/analysis';
import { getAnalysisData } from './mockData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085/api';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const getAnalyses = async (filters: AnalysisFilters): Promise<PaginatedResponse<AnalysisResult>> => {
  if (USE_MOCK) {
    const mockData = getAnalysisData();
    const start = filters.page * filters.size;
    const end = start + filters.size;
    const filteredData = filters.repositoryName
      ? mockData.repositories.filter(repo => repo.name === filters.repositoryName)
      : mockData.repositories;

    return {
      data: filteredData.slice(start, end).map(repo => ({
        id: repo.id,
        repositoryName: repo.name,
        pullRequestId: parseInt(repo.id),
        branchName: repo.branch,
        commitCount: repo.commitCount,
        changedFilesCount: Math.floor(Math.random() * 20) + 1,
        additions: Math.floor(Math.random() * 500) + 1,
        deletions: Math.floor(Math.random() * 200) + 1,
        analyzedAt: repo.lastAnalysis,
        aiSummary: `Technical: ${repo.analysis.technicalComment}\nFunctional: ${repo.analysis.functionalComment}\nArchitectural: ${repo.analysis.architecturalComment}`
      })),
      total: filteredData.length,
      page: filters.page,
      size: filters.size
    };
  }

  const response = await fetch(
    `${API_URL}/analyses?page=${filters.page}&size=${filters.size}${
      filters.repositoryName ? `&repositoryName=${filters.repositoryName}` : ''
    }`
  );
  return response.json();
};

export const getContextGraph = async (repoId: number, branch?: string): Promise<PullRequestNode[]> => {
  if (USE_MOCK) {
    const mockData = getAnalysisData();
    return mockData.repositories.map(repo => ({
      id: parseInt(repo.id),
      branch: repo.branch,
      pusher: repo.pusher,
      headCommitMessage: repo.headCommitMessage,
      headCommitSha: repo.headCommitSha,
      commitCount: repo.commitCount,
      commits: [],
      analysis: {
        id: repo.analysis.id,
        technicalComment: repo.analysis.technicalComment,
        functionalComment: repo.analysis.functionalComment,
        architecturalComment: repo.analysis.architecturalComment,
        riskScore: repo.analysis.riskScore
      },
      createdBy: repo.createdBy,
      solves: repo.solves,
      repository: repo.repository
    }));
  }

  const url = branch 
    ? `${API_URL}/context-graph/${repoId}/${branch}`
    : `${API_URL}/context-graph/${repoId}`;
  const response = await fetch(url);
  return response.json();
}; 