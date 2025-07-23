import axios from "axios";

export const Home_Api={
    GetSubjectsWithLessons: async () => {
        try {
            return await axios.get(`/api/home/get-subject-with-lesson`);
        } catch (error) {
            throw new Error('Không thể lấy thông tin môn học và bài học: ');
        }
    }
}