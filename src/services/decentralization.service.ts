import { IBaseSearch, ResponseProps } from '@/types/base';
import { IDecentralization } from '@/types/decentralization';
import axios from 'axios';
const prefix = '/api/decentralization';

export const searchDecentralizationFromClient = async (
    request: IBaseSearch
): Promise<ResponseProps<IDecentralization[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/search`, request, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};