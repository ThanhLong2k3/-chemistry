import { IBaseSearch, ResponseProps } from '@/types/base';
import { IChapter } from '@/types/chapter';
import axios from 'axios';
import { env } from 'process';
const prefix = `${env.BASE_URL}/api/chapter`;


export const createChapter = async (request: IChapter): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateChapter = async (request: IChapter): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchChapter = async (
    request: IBaseSearch
): Promise<ResponseProps<IChapter[]>> => {
    const response = await axios?.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteChapter = async (data: {
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
