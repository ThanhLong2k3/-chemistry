import { get_subject_detail_by_id, GetSubjectsWithLessons } from "../repositories/home.repository";

export const GetSubjectsWithLessonsService = async () => {
    try {
        return await GetSubjectsWithLessons();
    } catch (error) {
        throw new Error('Không thể lấy thông tin môn học và bài học: ');
    }
};


export const GetSubjectDetailById = async (id:string) => {
    try {
        return await get_subject_detail_by_id(id);
    } catch (error) {
        throw new Error('Không thể lấy thông tin chương và bài học: ');
    }
};