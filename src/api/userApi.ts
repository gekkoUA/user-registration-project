import axios from 'axios';
import { UserDetails } from '../types/user';

const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getAll: async (): Promise<UserDetails[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<UserDetails> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: Omit<UserDetails, 'id'>): Promise<UserDetails> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: Partial<UserDetails>): Promise<UserDetails> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};