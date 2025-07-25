export interface NotificationSettings {
  pullRequests: boolean;
  mentions: boolean;
  issues: boolean;
  security: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor: string;
}

export interface EmailSettings {
  daily: boolean;
  weekly: boolean;
  mentions: boolean;
}

export interface IntegrationSettings {
  github: {
    connected: boolean;
    username: string;
    repositories: number;
    lastSync: string;
  };
  jira: {
    connected: boolean;
    workspace?: string;
    projects?: number;
  };
  slack: {
    connected: boolean;
    workspace?: string;
    channels?: number;
  };
}

export interface ApiKey {
  id: string;
  name: string;
  created: string;
  lastUsed: string;
  scopes: string[];
}

export interface UserSettings {
  notifications: NotificationSettings;
  theme: ThemeSettings;
  email: EmailSettings;
  integrations: IntegrationSettings;
  apiKeys: ApiKey[];
} 