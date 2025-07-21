import {
    searchDecentralizations,
} from '../repositories/decentralization.repository';


export const searchDecentralizationService = async () => {
    try {
        return await searchDecentralizations();
    } catch (error) {
        throw new Error('Không thể tìm kiếm phân quyền');
    }
};



