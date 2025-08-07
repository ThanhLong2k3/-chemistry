import env from '@/env';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { ILesson } from '@/types/lesson';
import axios from 'axios';
const prefix = `${env.BASE_URL}/lesson`;

export const createLesson = async (request: ILesson): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateLesson = async (request: ILesson): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchLesson = async (
    request: IBaseSearch
): Promise<ResponseProps<ILesson[]>> => {
    const response = await axios?.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteLesson = async (data: {
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
