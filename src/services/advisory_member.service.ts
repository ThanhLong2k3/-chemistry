import { IBaseSearch, ResponseProps } from '@/types/base';
import { IAdvisoryMember } from '@/types/advisory_member';
import axios from 'axios';
import env from '@/env';
const prefix = `${env.BASE_URL}/advisory_member`;


export const createAdvisoryMember = async (request: IAdvisoryMember): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateAdvisoryMember = async (request: IAdvisoryMember): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchAdvisoryMember = async (
    request: IBaseSearch
): Promise<ResponseProps<IAdvisoryMember[]>> => {
    const response = await axios?.post(`${prefix}/search`, request);
    return response.data;
};

export const deleteAdvisoryMember = async (data: {
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
