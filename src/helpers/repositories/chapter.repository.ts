import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IChapter } from '@/types/chapter';

// Thêm chương mới
export const createChapter = async (model: IChapter): Promise<any> => {
    try {
        const sql = 'CALL add_chapter(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.subject_id,
                model.description ?? null,
                model.created_by,
                model.sort_order
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật chương
export const updateChapter = async (model: IChapter): Promise<any> => {
    try {
        const sql = 'CALL update_chapter(?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.subject_id,
                model.description ?? null,
                model.updated_by,
                model.sort_order
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa chương (xoá mềm)
export const deleteChapter = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_chapter(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm chương có phân trang
export const searchChapters = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_chapters(?,?,?,?,?)';
        const searchChapterName = model.search_content_1 || null;
        const searchSubjectName = model.search_content_2 || null;
        const results = await db_Provider(sql, [
            model.page_index ?? 1,
            model.page_size ?? 10,
            model.order_type ?? 'ASC',
            searchChapterName,
            searchSubjectName
        ]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
