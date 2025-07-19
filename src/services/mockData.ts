import { AnalysisResult } from '../types/analysis';

const repositories = [
  'facebook/react',
  'vercel/next.js',
  'microsoft/typescript',
  'tailwindlabs/tailwindcss',
  'prisma/prisma',
  'nestjs/nest',
  'sveltejs/svelte',
  'remix-run/remix',
  'vitejs/vite',
  'denoland/deno'
];

const branchPrefixes = ['feature', 'bugfix', 'hotfix', 'refactor', 'chore'];

const generateMockAnalysis = (id: number): AnalysisResult => {
  const repo = repositories[Math.floor(Math.random() * repositories.length)];
  const branchPrefix = branchPrefixes[Math.floor(Math.random() * branchPrefixes.length)];
  const prId = Math.floor(Math.random() * 1000) + 1;
  const commitCount = Math.floor(Math.random() * 20) + 1;
  const changedFiles = Math.floor(Math.random() * 30) + 1;
  const additions = Math.floor(Math.random() * 1000) + 1;
  const deletions = Math.floor(Math.random() * 500);
  
  const summaries = [
    "Implements new authentication flow with improved security measures",
    "Optimizes database queries for better performance",
    "Adds comprehensive test coverage for core components",
    "Refactors state management for better maintainability",
    "Updates dependencies and fixes security vulnerabilities",
    "Implements responsive design for mobile devices",
    "Adds new feature for real-time collaboration",
    "Fixes critical bug in error handling logic",
    "Improves accessibility across components",
    "Implements caching mechanism for better performance"
  ];

  return {
    id: `analysis-${id}`,
    repositoryName: repo,
    pullRequestId: prId,
    branchName: `${branchPrefix}/${id}-${repo.split('/')[1]}-update`,
    commitCount,
    changedFilesCount: changedFiles,
    additions,
    deletions,
    analyzedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    aiSummary: summaries[Math.floor(Math.random() * summaries.length)]
  };
};

export const generateMockData = (page: number, size: number, filter?: string) => {
  const totalItems = 100;
  const allData = Array.from({ length: totalItems }, (_, i) => generateMockAnalysis(i + 1));
  
  const filteredData = filter
    ? allData.filter(item => 
        item.repositoryName.toLowerCase().includes(filter.toLowerCase())
      )
    : allData;

  const start = page * size;
  const paginatedData = filteredData.slice(start, start + size);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    size
  };
}; 