import { IBaseSearch, ResponseProps } from '@/types/base';
import { IPerson } from '@/types/person';
import axios from 'axios';
const prefix = '/api/person';

export const createPerson = async (request: IPerson): Promise<ResponseProps> => {
  const response = await axios.post(`${prefix}/create`, request);
  return response.data;
};

export const updatePerson = async (request: IPerson): Promise<ResponseProps> => {
  const response = await axios.post(`${prefix}/update`, request);
  return response.data;
};

export const searchPerson = async (
  request: IBaseSearch
): Promise<ResponseProps<IPerson[]>> => {
  const response = await axios?.post(`${prefix}/search`, request);
  return response.data;
};

export const deletePerson = async (data: {
  PersonId: string;
}): Promise<ResponseProps> => {
  const response = await axios?.post(`${prefix}/delete`, data);
  return response.data;
};

export const getPersonById =async (): Promise<any> => {
  const ID_User=localStorage.getItem('ID_USER');
  const response = await axios?.post(`${prefix}/getPersonbyuserId`, ID_User);
  return response.data;
};
