import { RepositoryFromApi } from '../types/repositoryFromApi';
import apiClient from './apiClient';
import { authService } from './authService';

export const githubRepositoryService = {
    getUserRepositories: async (username: string): Promise<RepositoryFromApi[]> => {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User is not authenticated');
            }
            const response = await apiClient.get<RepositoryFromApi[]>(`/git/${username}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                authService.logout(); 
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
            
            
            throw error;
        }
    }
}; 