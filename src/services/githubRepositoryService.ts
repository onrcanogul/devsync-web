import { RepositoryFromApi } from '../types/repositoryFromApi';
import apiClient from './apiClient';
import { authService } from './authService';

export const githubRepositoryService = {
    getUserRepositories: async (username: string): Promise<RepositoryFromApi[]> => {
        try {
            // Token kontrolü
            if (!authService.isAuthenticated()) {
                throw new Error('User is not authenticated');
            }

            const response = await apiClient.get<RepositoryFromApi[]>(`/git/${username}`);
            return response.data;
        } catch (error: any) {
            // Eğer 403 hatası alırsak, kullanıcıyı login sayfasına yönlendirelim
            if (error.response?.status === 403) {
                authService.logout(); // Token'ları temizle
                window.location.href = '/login'; // Login sayfasına yönlendir
                throw new Error('Session expired. Please login again.');
            }
            
            console.error('Error fetching user repositories:', error);
            throw error;
        }
    }
}; 