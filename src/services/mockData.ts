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
    totalRepositories: 12,
    activeProjects: 5,
    totalCommits: 847,
    codeReviews: 32,
  },
  recentActivities: [
    {
      id: 1,
      title: 'New commit: Update user authentication',
      repository: 'auth-service',
      type: 'commit',
      timestamp: '2024-01-25T10:30:00Z',
      user: {
        name: 'John Doe',
        avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
      },
    },
    {
      id: 2,
      title: 'Pull request: Add dark mode support',
      repository: 'frontend-app',
      type: 'pull_request',
      timestamp: '2024-01-24T15:45:00Z',
      user: {
        name: 'Jane Smith',
        avatar: 'https://avatars.githubusercontent.com/u/2345678?v=4',
      },
    },
    {
      id: 3,
      title: 'Issue: Fix memory leak in worker process',
      repository: 'backend-api',
      type: 'issue',
      timestamp: '2024-01-23T09:15:00Z',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://avatars.githubusercontent.com/u/3456789?v=4',
      },
    },
  ],
  popularRepositories: [
    {
      id: 1,
      name: 'auth-service',
      description: 'Authentication service with OAuth2 support',
      language: 'TypeScript',
      stars: 245,
    },
    {
      id: 2,
      name: 'frontend-app',
      description: 'React-based frontend application',
      language: 'TypeScript',
      stars: 187,
    },
    {
      id: 3,
      name: 'backend-api',
      description: 'RESTful API service',
      language: 'Java',
      stars: 156,
    },
  ],
});

export const getConnectedRepositories = () => [
  {
    id: 1,
    name: 'devsync-web',
    description: 'DevSync Web Application - Frontend',
    language: 'TypeScript',
    lastAnalysis: '2024-01-25T10:30:00Z',
    metrics: {
      codeQuality: 92,
      coverage: 87,
      performance: 95,
      security: 89
    },
    recentCommits: 24,
    openPRs: 3,
    status: 'healthy',
    owner: {
      login: 'onrcanogul',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4'
    },
    html_url: 'https://github.com/onrcanogul/devsync-web'
  },
  {
    id: 2,
    name: 'devsync-api',
    description: 'DevSync Backend API Service',
    language: 'Java',
    lastAnalysis: '2024-01-24T15:45:00Z',
    metrics: {
      codeQuality: 88,
      coverage: 92,
      performance: 87,
      security: 94
    },
    recentCommits: 18,
    openPRs: 2,
    status: 'warning',
    owner: {
      login: 'onrcanogul',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4'
    },
    html_url: 'https://github.com/onrcanogul/devsync-api'
  },
  {
    id: 3,
    name: 'git-service',
    description: 'Git Integration Service for DevSync',
    language: 'Java',
    lastAnalysis: '2024-01-23T09:15:00Z',
    metrics: {
      codeQuality: 90,
      coverage: 85,
      performance: 92,
      security: 91
    },
    recentCommits: 12,
    openPRs: 1,
    status: 'healthy',
    owner: {
      login: 'onrcanogul',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4'
    },
    html_url: 'https://github.com/onrcanogul/git-service'
  }
];

export const getRepositoryAnalysis = (id: number) => {
  const repo = getConnectedRepositories().find(r => r.id === id);
  if (!repo) return null;

  return {
    ...repo,
    detailedMetrics: {
      codeQuality: {
        overall: repo.metrics.codeQuality,
        details: {
          complexity: {
            score: 90,
            issues: [
              { severity: 'warning' as const, message: 'High cyclomatic complexity in AuthService.authenticate', file: 'src/services/AuthService.ts', line: 45 },
              { severity: 'info' as const, message: 'Consider breaking down large component', file: 'src/components/Dashboard.tsx', line: 120 }
            ]
          },
          duplication: {
            score: 94,
            issues: [
              { severity: 'info' as const, message: 'Similar code found in multiple utility functions', file: 'src/utils/helpers.ts', line: 23 }
            ]
          },
          maintainability: {
            score: 92,
            issues: [
              { severity: 'warning' as const, message: 'Too many dependencies in UserController', file: 'src/controllers/UserController.ts', line: 1 }
            ]
          }
        }
      },
      coverage: {
        overall: repo.metrics.coverage,
        details: {
          unit: {
            percentage: 89,
            covered: 423,
            total: 475
          },
          integration: {
            percentage: 85,
            covered: 156,
            total: 183
          },
          e2e: {
            percentage: 78,
            covered: 45,
            total: 58
          }
        }
      },
      performance: {
        overall: repo.metrics.performance,
        details: {
          loadTime: {
            score: 94,
            value: '1.2s',
            threshold: '2s'
          },
          firstContentfulPaint: {
            score: 96,
            value: '0.8s',
            threshold: '1.5s'
          },
          timeToInteractive: {
            score: 92,
            value: '2.1s',
            threshold: '3.5s'
          }
        }
      },
      security: {
        overall: repo.metrics.security,
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 5
        },
        details: [
          {
            severity: 'high' as const,
            title: 'Outdated dependency with known vulnerability',
            description: 'axios@0.21.1 has a known security vulnerability',
            file: 'package.json',
            recommendation: 'Update to axios@0.21.4 or later'
          },
          {
            severity: 'medium' as const,
            title: 'Insecure random number generation',
            description: 'Math.random() used for security-sensitive operation',
            file: 'src/utils/crypto.ts',
            line: 34,
            recommendation: 'Use crypto.getRandomValues() instead'
          }
        ]
      },
      contextAnalysis: {
        summary: "Bu repository, modern bir web uygulamasının frontend kısmını içeriyor. React ve TypeScript kullanılarak geliştirilmiş. Kod organizasyonu genel olarak iyi durumda, ancak bazı iyileştirme alanları mevcut.",
        keyFindings: [
          {
            title: "Component Mimarisi",
            analysis: "Components klasörü altında atomic design prensipleri takip ediliyor. Ancak bazı componentler çok fazla sorumluluk üstlenmiş durumda. Özellikle Dashboard ve AnalysisDetail componentleri daha küçük parçalara bölünebilir.",
            recommendation: "Büyük componentleri daha küçük, yeniden kullanılabilir parçalara ayırmayı öneririz. Örneğin, Dashboard içindeki metrik kartları ayrı bir component olabilir.",
            impact: 'high' as const
          },
          {
            title: "State Yönetimi",
            analysis: "Global state yönetimi için Context API kullanılıyor. Ancak bazı state'ler gereksiz yere global tutulmuş. Özellikle UI state'leri component seviyesinde tutulabilir.",
            recommendation: "Global state'i sadece gerçekten birden fazla component tarafından paylaşılması gereken veriler için kullanın.",
            impact: 'medium' as const
          },
          {
            title: "API İntegrasyonu",
            analysis: "API çağrıları services katmanında merkezi olarak yönetiliyor, bu iyi bir pratik. Ancak error handling ve retry mekanizmaları eksik.",
            recommendation: "Axios interceptor'ları kullanarak merkezi bir error handling mekanizması kurulabilir. Ayrıca önemli API çağrıları için retry logic eklenebilir.",
            impact: 'high' as const
          },
          {
            title: "Test Coverage",
            analysis: "Unit test coverage'ı iyi durumda (%89), ancak integration testleri yetersiz. Özellikle kritik iş akışları için end-to-end testler eksik.",
            recommendation: "Cypress veya Playwright kullanarak kritik kullanıcı akışları için E2E testler yazılmalı.",
            impact: 'medium' as const
          },
          {
            title: "Performans Optimizasyonu",
            analysis: "React.memo ve useMemo kullanımı ile gereksiz render'lar önlenmiş. Ancak bazı büyük bundle'lar lazy loading ile bölünebilir.",
            recommendation: "Route bazlı code splitting uygulayarak initial bundle size küçültülebilir.",
            impact: 'low' as const
          }
        ],
        dependencies: {
          direct: [
            { name: "react", version: "^18.2.0", usage: "Core framework" },
            { name: "@mui/material", version: "^5.15.0", usage: "UI components" },
            { name: "axios", version: "0.21.1", usage: "HTTP client", warning: "Needs update - security vulnerability" }
          ],
          dev: [
            { name: "typescript", version: "^5.0.0", usage: "Type checking" },
            { name: "jest", version: "^29.0.0", usage: "Testing framework" },
            { name: "eslint", version: "^8.0.0", usage: "Code linting" }
          ]
        },
        codePatterns: {
          good: [
            "Consistent use of TypeScript and proper type definitions",
            "Component composition and reusability",
            "Centralized API service layer",
            "Proper error boundaries implementation"
          ],
          needsImprovement: [
            "Some components violate single responsibility principle",
            "Inconsistent error handling across API calls",
            "Missing loading states in some components",
            "Duplicate code in utility functions"
          ]
        }
      }
    },
    recentAnalyses: [
      {
        date: '2024-01-25T10:30:00Z',
        metrics: {
          codeQuality: 92,
          coverage: 87,
          performance: 95,
          security: 89
        }
      },
      {
        date: '2024-01-24T10:30:00Z',
        metrics: {
          codeQuality: 90,
          coverage: 85,
          performance: 94,
          security: 89
        }
      },
      {
        date: '2024-01-23T10:30:00Z',
        metrics: {
          codeQuality: 88,
          coverage: 83,
          performance: 92,
          security: 87
        }
      }
    ]
  };
};

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