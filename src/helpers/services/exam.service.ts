import { IExam } from '@/types/exam';

import {
    createExam,
    deleteExam,
    getExamCreatedByName,
    searchExams,
    updateExam,
} from '../repositories/exam.repository';

import { IBaseSearch } from '@/types/base';

export const createExamService = async (model: IExam) => {
    try {
        // Validate input
        if (!model.id?.trim()) throw new Error('id bài kiểm tra không được để trống');
        if (!model.name?.trim()) throw new Error('Tên bài kiểm tra không được để trống');

        // Save
        const result = await createExam(model);

        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi tạo bài kiểm tra');
    }
};

export const updateExamService = async (model: IExam) => {
    try {
        if (!model.id?.trim()) throw new Error('id bài kiểm tra không được để trống');
        if (!model.name?.trim()) throw new Error('Tên bài kiểm tra không được để trống');

        const result = await updateExam(model);
        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật bài kiểm tra');
    }
};

export const searchExamService = async (model: IBaseSearch) => {
    try {
        return await searchExams(model);
    } catch (error) {
        throw new Error('Không thể tìm kiếm bài kiểm tra');
    }
};

export const deleteExamService = async (id: string, deletedBy: string) => {
    try {
        return await deleteExam(id, deletedBy);
    } catch (error) {
        throw new Error('Không thể xóa bài kiểm tra' + error);
    }
};


export const getExamCreatedByNameService = async () => {
    try {
        return await getExamCreatedByName();
    } catch (error) {
        throw new Error('Không thể lấy danh sách người tạo đề kiểm tra.');
    }
};

