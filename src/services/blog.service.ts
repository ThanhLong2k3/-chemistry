import env from '@/env';
import { IAccount } from '@/types/account';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { IBlog } from '@/types/blog';
import axios from 'axios';

const prefix = `${env.BASE_URL}/blog`;


export const createBlog = async (request: IBlog): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateBlog = async (request: IBlog): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchBlog = async (
    request: IBaseSearch
): Promise<ResponseProps<IBlog[]>> => {
    const response = await axios.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteBlog = async (data: {
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

export const getBlogAuthors = async (): Promise<ResponseProps<IAccount[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/authors`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};