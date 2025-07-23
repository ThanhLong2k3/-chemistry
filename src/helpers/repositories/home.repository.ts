import { db_Provider } from '@/app/api/Api_Provider';

import { IChapter_Home, ISubject_Home } from '@/types/home';

export const GetSubjectsWithLessons = async (): Promise<ISubject_Home[]> => {
    try {
        const sql = 'CALL get_subjects_with_lessons()';
      
        const results = await db_Provider(sql);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const get_subject_detail_by_id = async (id:string): Promise<IChapter_Home[]> => {
    try {
        const sql = 'CALL get_subject_detail_by_id(?)';
        const results = await db_Provider(sql, [id]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
