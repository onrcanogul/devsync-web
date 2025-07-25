// Utility functions
import { Repository } from '../types/analysis';

const randomInt = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElement = <T extends readonly any[]>(array: T): T[number] => 
  array[Math.floor(Math.random() * array.length)];

const generateId = () => 
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const randomDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, days));
  return date.toISOString();
};

// Mock data constants
const POPULAR_REPOS = [
  { org: 'facebook', repo: 'react', desc: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.' },
  { org: 'vercel', repo: 'next.js', desc: 'The React Framework for Production' },
  { org: 'microsoft', repo: 'vscode', desc: 'Visual Studio Code' },
  { org: 'mui', repo: 'material-ui', desc: 'MUI Core: Ready-to-use foundational React components' },
  { org: 'tailwindlabs', repo: 'tailwindcss', desc: 'A utility-first CSS framework for rapid UI development' },
] as const;

const LANGUAGES = ['TypeScript', 'Python', 'Java', 'Go'];
const ACTIVITY_TYPES = ['commit', 'pull_request', 'issue', 'review'];
const USERNAMES = ['Ahmet Yılmaz', 'Mehmet Demir', 'Ayşe Kaya', 'Fatma Şahin', 'Ali Öztürk'];
const AVATARS = [
  'https://ui-avatars.com/api/?name=AY&background=random',
  'https://ui-avatars.com/api/?name=MD&background=random',
  'https://ui-avatars.com/api/?name=AK&background=random',
  'https://ui-avatars.com/api/?name=FS&background=random',
  'https://ui-avatars.com/api/?name=AO&background=random',
];

const REPOSITORY_NAMES = [
  'devsync-web',
  'devsync-api',
  'devsync-mobile',
  'devsync-docs',
];

const ORGANIZATIONS = [
  'devsync',
  'acme-corp',
  'tech-solutions',
  'innovate-labs',
];

// Mock bir repository oluşturan yardımcı fonksiyon
const generateMockRepository = (): Repository => {
  const repoInfo = randomElement(POPULAR_REPOS);
  return {
    id: randomInt(1000, 9999),
    name: repoInfo.repo,
    fullName: `${repoInfo.org}/${repoInfo.repo}`,
    htmlUrl: `https://github.com/${repoInfo.org}/${repoInfo.repo}`,
    visibility: randomElement(['public', 'private']),
    language: randomElement(LANGUAGES),
    description: repoInfo.desc,
    defaultBranch: 'main',
    ownerLogin: repoInfo.org,
    ownerId: randomInt(1000, 9999),
  };
};

// Dashboard için mock data
export const getDashboardData = () => ({
  stats: {
    totalRepositories: randomInt(10, 50),
    activeProjects: randomInt(5, 20),
    totalCommits: randomInt(1000, 5000),
    codeReviews: randomInt(20, 100),
  },
  recentActivities: Array.from({ length: 5 }, () => {
    const repo = generateMockRepository();
    return {
      id: generateId(),
      type: randomElement(ACTIVITY_TYPES),
      title: `Updated ${randomElement(['README.md', 'package.json', 'src/components', 'tests'])}`,
      repository: repo.name,
      timestamp: randomDate(7),
      user: {
        name: randomElement(USERNAMES),
        avatar: randomElement(AVATARS),
      },
    };
  }),
  popularRepositories: Array.from({ length: 4 }, () => {
    const repo = generateMockRepository();
    return {
      id: generateId(),
      name: repo.name,
      description: repo.description,
      stars: randomInt(10, 1000),
      language: repo.language,
      lastUpdated: randomDate(30),
    };
  }),
});

// Analizler için mock data
export const getAnalysisData = () => ({
  repositories: Array.from({ length: 8 }, () => ({
    id: generateId(),
    name: randomElement(['auth-service', 'payment-api', 'user-interface', 'data-processor']),
    metrics: {
      codeQuality: randomInt(70, 100),
      coverage: randomInt(60, 100),
      performance: randomInt(75, 100),
    },
    lastAnalysis: randomDate(14),
    status: randomElement(['completed', 'in_progress', 'queued']),
    issues: {
      high: randomInt(0, 5),
      medium: randomInt(1, 10),
      low: randomInt(2, 15),
    },
  })),
  trends: {
    weekly: Array.from({ length: 7 }, () => ({
      date: randomDate(7),
      issues: randomInt(5, 30),
      fixes: randomInt(3, 25),
    })),
    languages: [
      { name: 'TypeScript', percentage: 45 },
      { name: 'Python', percentage: 25 },
      { name: 'Java', percentage: 20 },
      { name: 'Other', percentage: 10 },
    ],
  },
});

// Repositories için mock data
export const getRepositoriesData = () => ({
  repositories: Array.from({ length: 10 }, () => {
    const repository = generateMockRepository();
    return {
      ...repository,
      stats: {
        stars: randomInt(0, 500),
        forks: randomInt(0, 100),
        issues: randomInt(0, 50),
        pullRequests: randomInt(0, 20),
      },
      lastCommit: {
        hash: generateId(),
        message: `${randomElement(['Add', 'Update', 'Fix', 'Refactor'])} ${randomElement(['feature', 'bug', 'documentation', 'tests'])}`,
        author: randomElement(USERNAMES),
        date: randomDate(10),
      },
    };
  }),
});

// Code Review için mock data
export const getCodeReviewData = () => ({
  pullRequests: Array.from({ length: 6 }, () => {
    const repo = generateMockRepository();
    return {
      id: generateId(),
      title: `${randomElement(['Add', 'Update', 'Fix', 'Refactor'])} ${randomElement(['feature', 'bug', 'documentation', 'tests'])}`,
      author: {
        name: randomElement(USERNAMES),
        avatar: randomElement(AVATARS),
      },
      repository: repo.name,
      status: randomElement(['open', 'merged', 'closed']),
      created: randomDate(20),
      reviewers: Array.from({ length: randomInt(1, 3) }, () => ({
        name: randomElement(USERNAMES),
        avatar: randomElement(AVATARS),
        status: randomElement(['approved', 'commented', 'pending']),
      })),
      stats: {
        commits: randomInt(1, 10),
        comments: randomInt(0, 15),
        changedFiles: randomInt(1, 20),
      },
    };
  }),
});

// Issues için mock data
export const getIssuesData = () => ({
  issues: Array.from({ length: 12 }, () => {
    const repo = generateMockRepository();
    return {
      id: generateId(),
      title: `${randomElement(['Bug', 'Feature', 'Enhancement', 'Task'])}: ${randomElement(['Login', 'Dashboard', 'API', 'Database'])} ${randomElement(['not working', 'needs update', 'improvement', 'implementation'])}`,
      description: `We need to ${randomElement(['fix', 'implement', 'update', 'improve'])} the ${randomElement(['functionality', 'performance', 'UI', 'code'])}`,
      status: randomElement(['open', 'in_progress', 'resolved', 'closed']),
      priority: randomElement(['high', 'medium', 'low']),
      assignee: {
        name: randomElement(USERNAMES),
        avatar: randomElement(AVATARS),
      },
      repository: repo.name,
      labels: Array.from(
        { length: randomInt(1, 3) },
        () => randomElement(['bug', 'feature', 'enhancement', 'documentation', 'security'])
      ),
      created: randomDate(30),
      comments: randomInt(0, 10),
    };
  }),
  statistics: {
    total: randomInt(50, 200),
    open: randomInt(10, 50),
    inProgress: randomInt(5, 20),
    resolved: randomInt(20, 100),
    closed: randomInt(15, 80),
  },
});

// Ayarlar için mock data
export const getSettingsData = () => ({
  userPreferences: {
    notifications: {
      pullRequests: true,
      mentions: true,
      issues: true,
      security: true,
    },
    theme: {
      mode: 'dark',
      accentColor: '#6366F1',
    },
    language: 'tr',
    emailNotifications: {
      daily: true,
      weekly: false,
      mentions: true,
    },
  },
  integrations: {
    github: {
      connected: true,
      username: 'devuser',
      repositories: randomInt(5, 30),
      lastSync: randomDate(1),
    },
    jira: {
      connected: false,
    },
    slack: {
      connected: true,
      workspace: 'DevSync Team',
      channels: randomInt(1, 5),
    },
  },
  apiKeys: Array.from({ length: 2 }, () => ({
    id: generateId(),
    name: randomElement(['Development', 'Production']),
    created: randomDate(90),
    lastUsed: randomDate(7),
    scopes: ['read', 'write', 'admin'],
  })),
}); 

// Commit detayları için mock data
export const getCommitDetailData = () => {
  const repository = generateMockRepository();
  const hash = generateId();
  return {
    hash,
    message: `${randomElement(['Add', 'Update', 'Fix', 'Refactor'])} ${randomElement(['feature', 'bug', 'documentation', 'tests'])}`,
    date: randomDate(30),
    author: {
      name: randomElement(USERNAMES),
      avatar: randomElement(AVATARS),
    },
    type: randomElement(['feature', 'bugfix', 'refactor', 'other'] as const),
    stats: {
      changedFiles: randomInt(1, 20),
      additions: randomInt(10, 500),
      deletions: randomInt(5, 200),
    },
    analysis: `Bu commit ${randomElement(['önemli bir özellik ekliyor', 'kritik bir hatayı düzeltiyor', 'performans iyileştirmesi yapıyor', 'kod kalitesini artırıyor'])}. ${randomElement(['Test coverage artırılmış', 'Dokümantasyon güncellenmiş', 'Yeni unit testler eklenmiş', 'Kod tekrarı azaltılmış'])}. ${randomElement(['Güvenlik açısından risk içermiyor', 'Minimal risk içeriyor', 'Dikkatli test edilmeli', 'Code review gerekiyor'])}.`,
    repository,
  };
}; 