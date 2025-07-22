//1
import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IBlog } from '@/types/blog';

// Thêm bài viết mới
export const createBlog = async (model: IBlog): Promise<any> => {
    try {
        const sql = 'CALL add_blog(?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.image ?? null,
                model.title,
                model.description ?? null,
                model.created_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật bài viết
export const updateBlog = async (model: IBlog): Promise<any> => {
    try {
        const sql = 'CALL update_blog(?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.image ?? null,
                model.title,
                model.description ?? null,
                model.updated_by
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa bài viết (xoá mềm)
export const deleteBlog = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_blog(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm bài viết có phân trang
export const searchBlogs = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_blogs(?,?,?,?,?)';
        const searchTitle = model.search_content_1 || null;
        const searchAccountNameCreate = model.search_content_2 || null;
        const results = await db_Provider(sql, [
            model.page_index ?? 1,
            model.page_size ?? 10,
            model.order_type ?? 'ASC',
            searchTitle,
            searchAccountNameCreate
        ]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const getBlogAuthors = async (): Promise<any[]> => {
    try {
        const sql = 'CALL get_blog_authors()';
        const results = await db_Provider(sql);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};