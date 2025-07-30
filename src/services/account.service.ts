import { IBaseSearch, ResponseProps } from '@/types/base';
import { IAccount } from '@/types/account';
import axios from 'axios';
import env from '@/env';

// Nếu đang chạy phía server (API route), cần URL tuyệt đối

const prefix = `${env.BASE_URL}/api/account`;

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


