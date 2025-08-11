import axios from 'axios';
import { ResponseProps } from '@/types/base';
import { IDashboardStats, IBlogView } from '@/types/dashboard';
import env from '@/env';

const prefix = `${env.BASE_URL}/dashboard`;

export const getDashboardStats = async (): Promise<ResponseProps<IDashboardStats>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const getBlogViews = async (
    startDate: string,
    endDate: string
): Promise<ResponseProps<IBlogView[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.get(`${prefix}/blog-views`, {
        params: { startDate, endDate },
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};
