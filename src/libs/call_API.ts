import axios from 'axios';
import { apiClient } from './api';

export const API_URL = '/api';  

export const CallApi = {
  getAll: async <T>(nameApi: string): Promise<T[]> => {
    try {
      const response = await apiClient.get<T[]>(`${API_URL}/${nameApi}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Lỗi không xác định';
        throw new Error(
          `Failed to fetch ${nameApi}: ${message} (status: ${error.response?.status})`,
        );
      }
      throw error;
    }
  },

  create: async <T>(nameApi: string, data: unknown): Promise<T> => {
    try {
      const response = await apiClient.post<T>(`${API_URL}/${nameApi}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Lỗi không xác định';
        throw new Error(
          `Failed to create in ${nameApi}: ${message} (status: ${error.response?.status})`,
        );
      }
      throw error;
    }
  },

  update: async <T>(nameApi: string, data: unknown): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(`${API_URL}/${nameApi}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Lỗi không xác định';
        throw new Error(
          `Failed to update in ${nameApi}: ${message} (status: ${error.response?.status})`,
        );
      }
      throw error;
    }
  },

  delete: async <T>(nameApi: string, id: number | string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(`${API_URL}/${nameApi}`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Lỗi không xác định';
        throw new Error(
          `Failed to delete in ${nameApi}: ${message} (status: ${error.response?.status})`,
        );
      }
      throw error;
    }
  },
  deleteCustomerLink: async (nameApi: string , data:any) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${nameApi}`,{data} );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Lỗi không xác định';
        throw new Error(`Xóa liên kết khách hàng thất bại: ${message} (status: ${error.response?.status})`);
      }
      throw error;
    }
  },
};
