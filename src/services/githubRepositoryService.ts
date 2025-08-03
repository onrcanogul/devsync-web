import { RepositoryFromApi } from '../types/repositoryFromApi';
import apiClient from './apiClient';

export const githubRepositoryService = {
    getUserRepositories: async (username: string): Promise<RepositoryFromApi[]> => {
        try {
            const response = await apiClient.get<RepositoryFromApi[]>(`/git/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user repositories:', error);
            throw error;
        }
    }
}; 