//1
import { db_Provider } from '@/app/api/Api_Provider';

// lấy ra phân quyền
export const searchDecentralizations = async (): Promise<any> => {
    try {
        const sql = 'CALL get_decentralizations()';
        const results = await db_Provider(sql);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
