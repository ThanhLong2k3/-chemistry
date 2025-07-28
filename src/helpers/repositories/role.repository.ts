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

/**
 * Đếm số lượng tài khoản đang hoạt động theo một role_id cụ thể.
 * @param roleId - ID của vai trò cần kiểm tra.
 * @returns Số lượng tài khoản.
 */
export const countAccountsByRoleId = async (roleId: string): Promise<number> => {
    try {
        const sql = 'SELECT COUNT(*) as count FROM accounts WHERE role_id = ? AND deleted = FALSE';

        // `response` là object { success: true, details: [ { count: 1 } ] }
        const response = await db_Provider(sql, [roleId], true);

        // 1. Kiểm tra xem response có thành công không
        // 2. Lấy mảng `details` từ response, không phải `response` trực tiếp
        const resultDetails = response.details;

        // 3. Kiểm tra mảng `details` này
        if (response.success && resultDetails && resultDetails.length > 0) {
            // 4. Lấy giá trị 'count' từ phần tử đầu tiên của mảng `details`
            const count = resultDetails[0].count;
            console.log(`Đã đếm được: ${count} tài khoản.`);
            return count;
        }

        // Nếu không có details hoặc success là false, trả về 0
        return 0;

    } catch (error: any) {
        console.error("Lỗi khi đếm tài khoản theo vai trò:", error);
        throw new Error("Lỗi truy vấn cơ sở dữ liệu khi đếm tài khoản.");
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
