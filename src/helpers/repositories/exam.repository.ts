import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IExam } from '@/types/exam';

// Thêm bài kiểm tra mới
export const createExam = async (model: IExam): Promise<any> => {
    try {
        const sql = 'CALL add_exam(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.subject_id,
                model.file,
                model.description ?? null,
                model.created_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật bài kiểm tra
export const updateExam = async (model: IExam): Promise<any> => {
    try {
        const sql = 'CALL update_exam(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.subject_id,
                model.file,
                model.description ?? null,
                model.updated_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa bài kiểm tra (xoá mềm)
export const deleteExam = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_exam(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm bài kiểm tra có phân trang
export const searchExams = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_exams(?,?,?,?,?,?)';
        const searchExamName = model.search_content_1 || null;
        const searchSubjectName = model.search_content_2 || null;
        const searchCreatedByName = model.search_content_3 || null;
        const results = await db_Provider(sql, [
            model.page_index ?? 1,
            model.page_size ?? 10,
            model.order_type ?? 'ASC',
            searchExamName,
            searchSubjectName,
            searchCreatedByName
        ]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const getExamCreatedByName = async (): Promise<any[]> => {
    try {
        const sql = 'CALL get_exam_created_by_name()';
        const results = await db_Provider(sql);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};