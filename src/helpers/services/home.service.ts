import { get_chapter_subhect_by_idSubject, get_lesson_detail_by_id, GetSubjectsWithLessons } from "../repositories/home.repository";

export const GetSubjectsWithLessonsService = async () => {
    try {
        return await GetSubjectsWithLessons();
    } catch (error) {
        throw new Error('Không thể lấy thông tin môn học và bài học: ');
    }
};


export const GetChapterSubhectByIdSubject = async (id:string) => {
    try {
        return await get_chapter_subhect_by_idSubject(id);
    } catch (error) {
        throw new Error('Không thể lấy thông tin chương và bài học: ');
    }
};



export const getlessonDetailById = async (id:string) => {
    try {
        return await get_lesson_detail_by_id(id);
    } catch (error) {
        throw new Error('Không thể lấy thông tin chương và bài học: ');
    }
};