import axios from 'axios';
import { RepositoryFromApi } from '../types/repositoryFromApi';

const API_URL = 'http://localhost:8081';

export const githubRepositoryService = {
    getUserRepositories: async (username: string): Promise<RepositoryFromApi[]> => {
        try {
            const response = await axios.get<RepositoryFromApi[]>(`${API_URL}/api/git/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user repositories:', error);
            throw error;
        }
    }
}; 