import env from '@/env';
import { IBaseSearch, ResponseProps } from '@/types/base';
import { IDecentralization } from '@/types/decentralization';
import axios from 'axios';
const prefix = `${env.BASE_URL}/api/decentralization`;

export const searchDecentralizationFromClient = async (
    request: IBaseSearch
): Promise<ResponseProps<IDecentralization[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/search`, {
        params: request,
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};