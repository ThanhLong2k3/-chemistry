import { IBaseSearch, ResponseProps } from '@/types/base';
import { IRole } from '@/types/role';
import axios from 'axios';
const prefix = '/api/role';

export const createRole = async (request: IRole): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/create`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateRole = async (request: IRole): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/update`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchRole = async (request: IBaseSearch): Promise<ResponseProps<IRole[]>> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios.post(`${prefix}/search`, request, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const deleteRole = async (data: {
    id: string;
}): Promise<ResponseProps> => {
    const token = localStorage.getItem('TOKEN');
    const response = await axios?.post(`${prefix}/delete`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};


export const getPermissionsForRole = async (
    roleId: string
): Promise<ResponseProps<string[]>> => {
    try {
        const token = localStorage.getItem('TOKEN');
        const response = await axios.post(
            `${prefix}/get-permissions`, // Gọi đến endpoint mới
            { role_id: roleId }, // Gửi roleId trong body
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        // Ném lỗi ra để component có thể bắt và xử lý
        console.error(`Lỗi khi lấy quyền cho vai trò ${roleId}:`, error);
        throw error;
    }
};


export const updatePermissionsForRoleOnClient = async (
    roleId: string,
    permissionIds: string[]
): Promise<ResponseProps> => {
    try {
        const token = localStorage.getItem('TOKEN');
        const response = await axios.post(
            `${prefix}/update-permissions`, // Gọi đến endpoint update
            {
                role_id: roleId,
                permission_ids: permissionIds
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật quyền cho vai trò ${roleId}:`, error);
        throw error;
    }
};