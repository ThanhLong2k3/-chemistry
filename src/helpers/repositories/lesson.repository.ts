import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { ILesson } from '@/types/lesson';
import { mode } from 'd3';

// Thêm bài học mới
export const createLesson = async (model: ILesson): Promise<any> => {
    try {
        const sql = 'CALL add_lesson(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.image,
                model.chapter_id,
                model.description ?? null,
                model.created_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật bài học
export const updateLesson = async (model: ILesson): Promise<any> => {
    try {
        const sql = 'CALL update_lesson(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.image,
                model.chapter_id,
                model.description ?? null,
                model.updated_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa bài học (xoá mềm)
export const deleteLesson = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_lesson(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm môn học có phân trang
export const searchLessons = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_lessons(?,?,?,?)';
        const searchContent = model.search_content || null;
        const results = await db_Provider(sql, [
            model.page_index ?? 0,
            model.page_size ?? 10,
            model.order_type ?? 'ASC',
            searchContent,
        ]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
