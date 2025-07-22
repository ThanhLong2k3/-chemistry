import { IAdvisoryMember } from '@/types/advisory_member';

import {
    createAdvisoryMember,
    deleteAdvisoryMember,
    searchAdvisoryMembers,
    updateAdvisoryMember,
} from '../repositories/advisory_member.repository';

import { IBaseSearch } from '@/types/base';

export const createAdvisoryMemberService = async (model: IAdvisoryMember) => {
    try {
        // Validate input
        if (!model.id?.trim()) throw new Error('id thành viên ban tư vấn không được để trống');
        if (!model.teacher_name?.trim()) throw new Error('Tên giáo viên ban tư vấn không được để trống');

        // Save
        const result = await createAdvisoryMember(model);

        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi tạo thành viên ban tư vấn');
    }
};

export const updateAdvisoryMemberService = async (model: IAdvisoryMember) => {
    try {
        if (!model.id?.trim()) throw new Error('id thành viên ban tư vấn không được để trống');
        if (!model.teacher_name?.trim()) throw new Error('Tên thành viên ban tư vấn không được để trống');

        const result = await updateAdvisoryMember(model);
        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật thành viên ban tư vấn');
    }
};

export const searchAdvisoryMemberService = async (model: IBaseSearch) => {
    try {
        return await searchAdvisoryMembers(model);
    } catch (error) {
        throw new Error('Không thể tìm kiếm thành viên ban tư vấn');
    }
};

export const deleteAdvisoryMemberService = async (id: string, deletedBy: string) => {
    try {
        return await deleteAdvisoryMember(id, deletedBy);
    } catch (error) {
        throw new Error('Không thể xóa thành viên ban tư vấn' + error);
    }
};
