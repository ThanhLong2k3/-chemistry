//1
import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { ISubject } from '@/types/subject';

// Thêm môn học mới
export const createSubject = async (model: ISubject): Promise<any> => {
    try {
        const sql = 'CALL add_subject(?,?,?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.image ?? null,
                model.description ?? null,
                model.textbook ?? null,
                model.workbook ?? null,
                model.exercise_book ?? null,
                model.created_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật môn học
export const updateSubject = async (model: ISubject): Promise<any> => {
    try {
        const sql = 'CALL update_subject(?,?,?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.image ?? null,
                model.description ?? null,
                model.textbook ?? null,
                model.workbook ?? null,
                model.exercise_book ?? null,
                model.updated_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa môn học (xoá mềm)
export const deleteSubject = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_subject(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm môn học có phân trang
export const searchSubjects = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_subjects(?,?,?,?)';
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
