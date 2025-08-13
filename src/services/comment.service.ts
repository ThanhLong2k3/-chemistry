import env from '@/env';
import { IAccount } from '@/types/account';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { IComment } from '@/types/comment';
import axios from 'axios';

const prefix = `${env.BASE_URL}/comment`;


export const createComment = async (request: any): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateComment = async (request: IComment): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchComment = async (
    request: IBaseSearch
): Promise<ResponseProps<IComment[]>> => {
    const response = await axios.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteComment = async (data: {
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

export const getCommentAuthors = async (): Promise<ResponseProps<IAccount[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/authors`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};