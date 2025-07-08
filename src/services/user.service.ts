import { IBaseSearch, ResponseProps } from '@/types/base';
import { IUser } from '@/types/user';
import axios from 'axios';
const prefix = '/api/user';

export const createUser = async (request: IUser): Promise<ResponseProps> => {
  const response = await axios.post(`${prefix}/create`, request);
  return response.data;
};

export const updateUser = async (request: IUser): Promise<ResponseProps> => {
  const response = await axios.post(`${prefix}/update`, request);
  return response.data;
};

export const searchUser = async (
  request: IBaseSearch
): Promise<ResponseProps<IUser[]>> => {
  const response = await axios?.post(`${prefix}/search`, request);
  return response.data;
};

export const deleteUser = async (data: {
  UserId: string;
}): Promise<ResponseProps> => {
  const response = await axios?.post(`${prefix}/delete`, data);
  return response.data;
};

export const login =async (data:{ UserName: string, PassWork: string}): Promise<any> => {
  const response = await axios?.post(`${prefix}/login`, data);
 
  return response.data;
};
