import env from '@/env';
import axios from 'axios';
import { get } from 'lodash';
const prefix = `${env.BASE_URL}/api/home`;

export const Home_Api = {
  GetSubjectsWithLessons: async () => {
    try {
      return await axios.get(`${prefix}/get-subject-with-lesson`);
    } catch (error) {
      throw new Error('Không thể lấy thông tin môn học và bài học: ');
    }
  },
  GetChapterSubhectByIdSubject: async (id: string) => {
    try {
      return await axios.get(`${prefix}/get_chapter_subhect_by_idSubject`, {
        params: { id },
      });
    } catch (error) {
      throw new Error('Không thể lấy thông tin ');
    }
  },
    getLessonDetailById: async (id: string) => {
        try {
        return await axios.get(`${prefix}/get_lesson_detail_by_id`, {
            params: { id },
        });
        } catch (error) {
        throw new Error('Không thể lấy thông tin bài học: ');
        }
    },
     getBlogById: async (id: string) => {
        try {
        return await axios.get(`${prefix}/get_blog_by_id`, {
            params: { id },
        });
        } catch (error) {
        throw new Error('Không thể lấy thông tin bài viết: ');
        }
    },
    getExamByIdSubject: async (id: string) => {
    try {
      return await axios.get(`${prefix}/get_exam_by_id_subject`, {
        params: { id },
      });
    } catch (error) {
      throw new Error('Không thể lấy thông tin đề kiểm tra: ');
    }
  },
    getExamDetailById: async (id: string) => {
        try {
            return await axios.get(`${prefix}/get_exam_detail_by_id`, {
                params: { id },
            });
        } catch (error) {
            throw new Error('Không thể lấy thông tin đề kiểm tra: ');
        }
    }   

};
