//2
import { ISubject } from '@/types/subject';

import {
    createSubject,
    deleteSubject,
    searchSubjects,
    updateSubject,
} from '../repositories/subject.repository';

import { IBaseSearch } from '@/types/base';

const BCRYPT_ROUNDS = parseInt('10');

export const createSubjectService = async (model: ISubject) => {
    try {
        // Validate input
        if (!model.id?.trim()) throw new Error('id môn học không được để trống');
        if (!model.name?.trim()) throw new Error('Tên môn học không được để trống');

        // Save
        const result = await createSubject(model);

        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi tạo môn học');
    }
};

export const updateSubjectService = async (model: ISubject) => {
    try {
        if (!model.id?.trim()) throw new Error('id môn học không được để trống');
        if (!model.name?.trim()) throw new Error('Tên môn học không được để trống');

        const result = await updateSubject(model);
        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật môn học');
    }
};

export const searchSubjectService = async (model: IBaseSearch) => {
    try {
        return await searchSubjects(model);
    } catch (error) {
        throw new Error('Không thể tìm kiếm môn học');
    }
};

export const deleteSubjectService = async (id: string, deletedBy: string) => {
    try {
        return await deleteSubject(id, deletedBy);
    } catch (error) {
        throw new Error('Không thể xóa môn học' + error);
    }
};
