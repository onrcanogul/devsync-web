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

// Eski tipler (geriye dönük uyumluluk için)
export type CommitAnalysis = CommitAnalysisNode;
export type Commit = CommitNode;
export type Repository = RepositoryNode;

export interface CommitAnalysisNode {
  hash: string;
  technicalComment: string;
  functionalComment: string;
  architecturalComment: string;
  commitRiskScore: number;
}

export interface CommitNode {
  hash: string;
  message: string;
  analysis?: CommitAnalysisNode;
}

export interface UserNode {
  githubId: number;
  username: string;
  avatarUrl: string;
  email: string;
  userType: string;
}

export interface RepositoryNode {
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

export interface IssueNode {
  id: number;
  title: string;
  number: number;
  state: string;
}

export interface PullRequestAnalysisNode {
  id: number;
  technicalComment: string;
  functionalComment: string;
  architecturalComment: string;
  riskScore: number;
}

export interface PullRequestNode {
  id: number;
  branch: string;
  pusher: string;
  headCommitMessage: string;
  headCommitSha: string;
  commitCount: number;
  commits: CommitNode[];
  analysis: PullRequestAnalysisNode;
  createdBy: UserNode;
  solves: IssueNode[];
  repository: RepositoryNode;
  analyzedDate: Date;
}

export interface DashboardStats {
  totalRepositories: number;
  activeProjects: number;
  totalCommits: number;
  codeReviews: number;
}

export interface DashboardActivity {
  id: number;
  type: 'commit' | 'pull_request' | 'issue' | 'review';
  title: string;
  repository: string;
  timestamp: string;
  user: {
    username: string;
    avatar: string;
  };
}

export interface PopularRepository {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
  popularRepositories: PopularRepository[];
}