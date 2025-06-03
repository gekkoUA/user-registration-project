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
    try {
      const response = await apiClient.get<UserDetails[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<UserDetails> => {
    try {
      const response = await apiClient.get<UserDetails>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  create: async (userData: Omit<UserDetails, 'id'>): Promise<UserDetails> => {
    try {
      // Generate a unique ID for json-server
      const userWithId = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const response = await apiClient.post<UserDetails>('/users', userWithId);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id: string, userData: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await apiClient.put<UserDetails>(`/users/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Upload photo method (simplified for json-server)
  uploadPhoto: async (file: File): Promise<{ url: string; id: number }> => {
    try {
      // For json-server, we'll convert the file to base64 data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            id: Date.now(),
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },
};