// app/api/apiService.ts
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Item, CreateItemDTO, UpdateItemDTO, ApiError, PaginatedResponse } from '../types/api';

const BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const customError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export const apiService = {
  getItems: async (): Promise<PaginatedResponse<Item>> => {
    const { data } = await api.get<PaginatedResponse<Item>>('/items');
    return data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const { data } = await api.get<Item>(`/items/${id}`);
    return data;
  },

  createItem: async (newItem: CreateItemDTO): Promise<Item> => {
    const { data } = await api.post<Item>('/items', newItem);
    return data;
  },

  updateItem: async ({ id, ...updates }: UpdateItemDTO): Promise<Item> => {
    const { data } = await api.put<Item>(`/items/${id}`, updates);
    return data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};
