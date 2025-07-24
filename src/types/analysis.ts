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

export interface CommitAnalysis {
  hash: string;
  technicalComment: string;
  functionalComment: string;
  architecturalComment: string;
  commitRiskScore: number;
}

export interface Commit {
  hash: string;
  message: string;
  analysis: CommitAnalysis;
}

export interface GithubUser {
  githubId: number;
  username: string;
  avatarUrl: string;
  email: string | null;
  userType: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  visibility: string;
  language: string;
  description: string;
  defaultBranch: string;
  ownerLogin: string;
  ownerId: number;
}

export interface PullRequestNode {
  id: number;
  branch: string;
  pusher: string;
  headCommitMessage: string;
  headCommitSha: string;
  commitCount: number;
  commits: Commit[];
  analysis: {
    id: string | null;
    technicalComment: string;
    functionalComment: string;
    architecturalComment: string;
    riskScore: number;
  };
  createdBy: GithubUser | null;
  solves: number[];
  repository: Repository;
} 