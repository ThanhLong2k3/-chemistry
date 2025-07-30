import env from '@/env';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { ISubject } from '@/types/subject';
import axios from 'axios';
const prefix = `${env.BASE_URL}/api/subject`;

export const createSubject = async (request: ISubject): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateSubject = async (request: ISubject): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchSubject = async (
    request: IBaseSearch
): Promise<ResponseProps<ISubject[]>> => {
    const response = await axios?.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteSubject = async (data: {
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
