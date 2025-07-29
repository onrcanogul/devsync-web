export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string;
  stargazers_count: number;
  default_branch: string;
}

export interface WebhookConfig {
  url: string;
  content_type: string;
  events: string[];
}

export interface RepositoryAddResponse {
  repository: GitHubRepository;
  webhook: WebhookConfig;
  success: boolean;
  message: string;
}

export interface RepositoryFromGraph {
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