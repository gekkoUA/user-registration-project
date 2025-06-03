import axios from 'axios';
import { UserDetails } from '../types/user';

const API_BASE_URL = 'http://localhost:1337/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Strapi response wrapper type
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
}

interface StrapiMultipleResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
}

// Transform Strapi data to our format
const transformStrapiUser = (strapiUser: { id: number; attributes: UserDetails }): UserDetails => ({
  id: strapiUser.id.toString(),
  ...strapiUser.attributes,
});

const transformUserForStrapi = (user: Omit<UserDetails, 'id'>): { data: Omit<UserDetails, 'id'> } => ({
  data: user,
});

const transformUserUpdateForStrapi = (user: Partial<UserDetails>): { data: Partial<UserDetails> } => {
  const { id, ...userData } = user;
  return { data: userData };
};

export const userApi = {
  getAll: async (): Promise<UserDetails[]> => {
    const response = await apiClient.get<StrapiMultipleResponse<UserDetails>>('/user-details?populate=*');
    return response.data.data.map(transformStrapiUser);
  },

  getById: async (id: string): Promise<UserDetails> => {
    const response = await apiClient.get<StrapiSingleResponse<UserDetails>>(`/user-details/${id}?populate=*`);
    return transformStrapiUser(response.data.data);
  },

  create: async (userData: Omit<UserDetails, 'id'>): Promise<UserDetails> => {
    const response = await apiClient.post<StrapiSingleResponse<UserDetails>>(
      '/user-details', 
      transformUserForStrapi(userData)
    );
    return transformStrapiUser(response.data.data);
  },

  update: async (id: string, userData: Partial<UserDetails>): Promise<UserDetails> => {
    const response = await apiClient.put<StrapiSingleResponse<UserDetails>>(
      `/user-details/${id}`, 
      transformUserUpdateForStrapi(userData)
    );
    return transformStrapiUser(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/user-details/${id}`);
  },

  // Upload photo method
  uploadPhoto: async (file: File): Promise<{ url: string; id: number }> => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      url: `http://localhost:1337${response.data[0].url}`,
      id: response.data[0].id,
    };
  },
};