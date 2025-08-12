import { IDecodedToken } from '@/types/decodedToken';
import { jwtDecode } from 'jwt-decode';

export const getAccountLogin = () => {
    try {
        const token = localStorage.getItem('TOKEN');
        if (!token) return null;

        const accountInfo = jwtDecode<IDecodedToken>(token);
        return accountInfo;
    } catch (error) {
        localStorage.removeItem('TOKEN');
        return null;
    }
};
