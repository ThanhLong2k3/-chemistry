import { ILesson } from '@/types/lesson';

import {
    createLesson,
    deleteLesson,
    searchLessons,
    updateLesson,
} from '../repositories/lesson.repository';

import { IBaseSearch } from '@/types/base';

export const createLessonService = async (model: ILesson) => {
    try {
        // Validate input
        if (!model.id?.trim()) throw new Error('id bài học không được để trống');
        if (!model.name?.trim()) throw new Error('Tên bài học không được để trống');

        // Save
        const result = await createLesson(model);

        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi tạo bài học');
    }
};

export const updateLessonService = async (model: ILesson) => {
    try {
        if (!model.id?.trim()) throw new Error('id bài học không được để trống');
        if (!model.name?.trim()) throw new Error('Tên bài học không được để trống');

        const result = await updateLesson(model);
        return result;
    } catch (error: any) {
        throw new Error(error.message || 'Lỗi khi cập nhật bài học');
    }
};

export const searchLessonService = async (model: IBaseSearch) => {
    try {
        return await searchLessons(model);
    } catch (error) {
        throw new Error('Không thể tìm kiếm bài học');
    }
};

export const deleteLessonService = async (id: string, deletedBy: string) => {
    try {
        return await deleteLesson(id, deletedBy);
    } catch (error) {
        throw new Error('Không thể xóa bài học' + error);
    }
};
