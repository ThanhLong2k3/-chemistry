import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IRole } from '@/types/role';
import { mode } from 'd3';

// Thêm nhóm quyền mới
export const createRole = async (model: IRole): Promise<any> => {
    try {
        const sql = 'CALL add_role(?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.description ?? null
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật nhóm quyền
export const updateRole = async (model: IRole): Promise<any> => {
    try {
        const sql = 'CALL update_role(?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.name,
                model.description ?? null,
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa nhóm quyền (xoá mềm)
export const deleteRole = async (id: string): Promise<any> => {
    try {
        const sql = 'CALL delete_role(?)';
        return await db_Provider(sql, [id], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm môn học có phân trang
export const searchRoles = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_roles(?,?,?,?)';
        const searchContent = model.search_content_1 || null;
        const results = await db_Provider(sql, [
            model.page_index ?? 1,
            model.page_size ?? 10,
            model.order_type ?? 'ASC',
            searchContent,
        ]);
        return results;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
