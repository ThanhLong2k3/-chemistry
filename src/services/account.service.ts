import { IBaseSearch, ResponseProps } from '@/types/base';
import { IAccount } from '@/types/account';
import axios from 'axios';

// Nếu đang chạy phía server (API route), cần URL tuyệt đối
const baseURL =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    : ''; // phía client thì dùng URL tương đối

const prefix = `${baseURL}/api/account`;

export const createAccount = async (request: IAccount): Promise<ResponseProps> => {
  const token = localStorage.getItem('TOKEN');
  const response = await axios.post(`${prefix}/create`, request, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateAccount = async (request: IAccount): Promise<ResponseProps> => {
  const token = localStorage.getItem('TOKEN');
  const response = await axios.post(`${prefix}/update`, request, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const searchAccount = async (
  request: IBaseSearch
): Promise<ResponseProps<IAccount[]>> => {
  const token = localStorage.getItem('TOKEN');
  const response = await axios.post(`${prefix}/search`, request, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};


export const deleteAccount = async (data: { username: string, deleted_by: string }): Promise<ResponseProps> => {
  const token = localStorage.getItem('TOKEN');
  const response = await axios.post(`${prefix}/delete`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};


