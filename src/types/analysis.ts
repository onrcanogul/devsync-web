export interface AnalysisResult {
  id: string;
  repositoryName: string;
  pullRequestId: number;
  branchName: string;
  commitCount: number;
  changedFilesCount: number;
  additions: number;
  deletions: number;
  analyzedAt: string;
  aiSummary: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface AnalysisFilters {
  repositoryName?: string;
  page: number;
  size: number;
} 