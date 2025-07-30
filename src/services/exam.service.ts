import env from '@/env';
import { IAccount } from '@/types/account';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { IExam } from '@/types/exam';
import axios from 'axios';
const prefix = `${env.BASE_URL}/api/exam`;


export const createExam = async (request: IExam): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateExam = async (request: IExam): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchExam = async (
    request: IBaseSearch
): Promise<ResponseProps<IExam[]>> => {
    const response = await axios?.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteExam = async (data: {
    id: string;
    deleted_by: string;
}): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios?.post(`${prefix}/delete`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};


export const getExamCreatedByName = async (): Promise<ResponseProps<IAccount[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/created_by_name`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};