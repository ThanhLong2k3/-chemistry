import axios from 'axios';

export const Home_Api = {
  GetSubjectsWithLessons: async () => {
    try {
      return await axios.get(`/api/home/get-subject-with-lesson`);
    } catch (error) {
      throw new Error('Không thể lấy thông tin môn học và bài học: ');
    }
  },
  GetChapterSubhectByIdSubject: async (id: string) => {
    try {
      return await axios.get(`/api/home/get_chapter_subhect_by_idSubject`, {
        params: { id },
      });
    } catch (error) {
      throw new Error('Không thể lấy thông tin ');
    }
  },
    getLessonDetailById: async (id: string) => {
        try {
        return await axios.get(`/api/home/get_lesson_detail_by_id`, {
            params: { id },
        });
        } catch (error) {
        throw new Error('Không thể lấy thông tin bài học: ');
        }
    },
};
