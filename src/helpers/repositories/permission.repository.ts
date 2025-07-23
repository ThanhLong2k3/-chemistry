import { db_Provider } from '@/app/api/Api_Provider';

/**
 * Lấy toàn bộ thông tin phân quyền của một vai trò (role)
 * @param roleId ID của vai trò cần lấy thông tin
 */
export const getPermissionsByRole = async (roleId: string): Promise<any[]> => {
    try {
        const sql = 'CALL get_role_decentralizations_by_role(?)';
        const results = await db_Provider(sql, [roleId]);
        return results;
    } catch (error: any) {
        console.error(`Lỗi khi lấy phân quyền cho roleId ${roleId}:`, error);
        throw new Error(error.message);
    }
};

/**
 * Kiểm tra xem một vai trò có một quyền cụ thể hay không.
 * @param roleId ID của vai trò
 * @param permissionCode Mã quyền cần kiểm tra (ví dụ: 'USER_MANAGE')
 */
export const checkPermission = async (roleId: string, permissionCode: string): Promise<boolean> => {
    try {
        // Thủ tục này bạn cần tạo trong DB
        const sql = 'CALL check_role_permission(?, ?)';
        const result = await db_Provider(sql, [roleId, permissionCode]);

        if (result && result.length > 0) {
            return result[0].has_permission === 1;
        }
        return false;
    } catch (error: any) {
        console.error('Lỗi khi kiểm tra quyền:', error);
        throw new Error(error.message);
    }
};


/**
 * Cập nhật toàn bộ danh sách quyền cho một vai trò.
 * @param roleId ID của vai trò cần cập nhật
 * @param permissionIds Một mảng các ID quyền
 */
// File: src/helpers/repositories/permission.repository.ts
export const updatePermissionsForRole = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
    try {
        const idsString = permissionIds.join(',');
        const sql = 'CALL update_role_permissions(?, ?)';

        // Chúng ta không cần quan tâm đến kết quả trả về nữa
        // Chỉ cần biết nó có chạy thành công không
        await db_Provider(sql, [roleId, idsString]);

        // Nếu dòng trên không ném ra lỗi, có nghĩa là đã thành công
        return true;
    } catch (error: any) {
        console.error(`Lỗi khi cập nhật quyền cho roleId ${roleId}:`, error);
        // Nếu có lỗi, trả về false
        return false;
    }
};