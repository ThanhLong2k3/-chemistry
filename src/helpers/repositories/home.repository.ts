import { db_Provider } from '@/app/api/Api_Provider';

import { IChapter_Home, ILessonDetail, ISubject_Home } from '@/types/home';

export const GetSubjectsWithLessons = async (): Promise<ISubject_Home[]> => {
    try {
        const sql = 'CALL get_subjects_with_lessons()';
      
        const results = await db_Provider(sql);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const get_chapter_subhect_by_idSubject = async (id:string): Promise<IChapter_Home[]> => {
    try {
        const sql = 'CALL get_chapter_subhect_by_idSubject(?)';
        const results = await db_Provider(sql, [id]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};



export const get_lesson_detail_by_id = async (id:string): Promise<ILessonDetail[]> => {
    try {
        const sql = 'CALL get_lesson_detail_by_id(?)';
        const results = await db_Provider(sql, [id]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
