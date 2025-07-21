import { IRole } from '@/types/role';

import {
    createRole,
    deleteRole,
    searchRoles,
    updateRole,
} from '../repositories/role.repository';

import { IBaseSearch } from '@/types/base';
import { getPermissionsByRole, updatePermissionsForRole } from '../repositories/permission.repository';

const BCRYPT_ROUNDS = parseInt('10');

export const createRoleService = async (model: IRole) => {
    try {
        // Validate input
        if (!model.id?.trim()) throw new Error('id nhóm quyền không được để trống');
        if (!model.name?.trim()) throw new Error('Tên nhóm quyền không được để trống');

        // Save
        const result = await createRole(model);

        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi tạo nhóm quyền');
    }
};

export const updateRoleService = async (model: IRole) => {
    try {
        if (!model.id?.trim()) throw new Error('id nhóm quyền không được để trống');
        if (!model.name?.trim()) throw new Error('Tên nhóm quyền không được để trống');

        const result = await updateRole(model);
        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật nhóm quyền');
    }
};

export const searchRoleService = async (model: IBaseSearch) => {
    try {
        return await searchRoles(model);
    } catch (error) {
        throw new Error('Không thể tìm kiếm nhóm quyền');
    }
};

export const deleteRoleService = async (id: string) => {
    try {
        return await deleteRole(id);
    } catch (error) {
        throw new Error('Không thể xóa nhóm quyền' + error);
    }
};


export const updatePermissionsForRoleService = async (roleId: string, permissionIds: string[]) => {
    try {
        if (!roleId) {
            throw new Error("ID của vai trò không được để trống.");
        }
        // Kiểm tra permissionIds phải là một mảng
        if (!Array.isArray(permissionIds)) {
            throw new Error("Danh sách quyền không hợp lệ.");
        }

        // Hàm repository giờ trả về true/false
        return await updatePermissionsForRole(roleId, permissionIds);
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật phân quyền');
    }
};


/**
 * Service để lấy danh sách các quyền đã gán cho một vai trò.
 * @param roleId ID của vai trò
 * @returns Một mảng các ID của các mục phân quyền (decentralization_id)
 */
export const getRolePermissionsService = async (roleId: string) => {
    try {
        if (!roleId) {
            throw new Error("ID của vai trò không được để trống.");
        }

        // 1. Gọi repository để lấy dữ liệu đầy đủ từ CSDL
        const fullPermissionsInfo = await getPermissionsByRole(roleId);

        // 2. Chỉ trích xuất ra ID của các quyền (decentralization_id)
        //    Frontend chỉ cần thông tin này để tick vào checkbox
        const permissionIds = fullPermissionsInfo.map((p: any) => p.decentralization_id);

        return permissionIds;

    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi lấy danh sách quyền của vai trò');
    }
};