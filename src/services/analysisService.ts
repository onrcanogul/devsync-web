import { AnalysisResult, PaginatedResponse, AnalysisFilters } from '../types/analysis';
import { generateMockData } from './mockData';

export const analysisService = {
  getAnalyses: async (filters: AnalysisFilters): Promise<PaginatedResponse<AnalysisResult>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return generateMockData(filters.page, filters.size, filters.repositoryName);
  },
}; 