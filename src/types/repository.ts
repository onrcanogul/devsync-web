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