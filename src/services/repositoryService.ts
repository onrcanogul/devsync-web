import axios from 'axios';
import { GitHubRepository, RepositoryAddResponse } from '../types/repository';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const repositoryService = {
  // GitHub repository'yi doğrula ve ekle
  async addRepository(repoFullName: string): Promise<RepositoryAddResponse> {
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo amaçlı sadece facebook/react için başarılı yanıt dön
      if (repoFullName.toLowerCase() === 'facebook/react') {
        const mockResponse: RepositoryAddResponse = {
          success: true,
          message: 'Repository başarıyla eklendi',
          repository: {
            id: 10270250,
            name: 'react',
            full_name: 'facebook/react',
            description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
            html_url: 'https://github.com/facebook/react',
            private: false,
            owner: {
              login: 'facebook',
              avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4'
            },
            language: 'JavaScript',
            stargazers_count: 200000,
            default_branch: 'main'
          },
          webhook: {
            url: 'https://api.devsync.com/github/webhook',
            content_type: 'application/json',
            events: ['push', 'pull_request']
          }
        };
        return mockResponse;
      }

      throw new Error('Repository bulunamadı');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Repository eklenirken bir hata oluştu');
      }
      throw new Error('Repository eklenirken bir hata oluştu');
    }
  },

  // GitHub repository bilgilerini getir
  async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      throw new Error('Repository bilgileri alınamadı');
    }
  }
}; 