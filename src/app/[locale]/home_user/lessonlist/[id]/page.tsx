'use client';
import LessonList from '@/modules/systems/manage-web/components/LessonList/LessonListpage';
import { useParams } from 'next/navigation';

interface Lesson {
  id: string;
  name: string;
  description?: string;
  image?: string;
}
interface Chapter {
  id: string;
  name: string;
  description?: string;
  lessons: Lesson[];
}
const LessonListPage = () => {
  const params = useParams();
  const id = params?.id;

  const sampleChapters: Chapter[] = [
    {
      id: 'chap1',
      name: 'Chương 1: Cấu tạo nguyên tử',
      description:
        'Tìm hiểu về thành phần nguyên tử, nguyên tố và cấu trúc lớp vỏ electron.',
      lessons: [
        {
          id: 'lesson1',
          name: 'Bài 1: Thành phần của nguyên tử',
          description: 'Khám phá proton, neutron và electron trong nguyên tử.',
          image: '/images/atom-structure.jpg',
        },
        {
          id: 'lesson2',
          name: 'Bài 2: Nguyên tố hóa học',
          description: 'Hiểu về nguyên tố và ký hiệu hóa học của chúng.',
          image: '/images/elements.jpg',
        },
        {
          id: 'lesson3',
          name: 'Bài 3: Cấu trúc lớp vỏ electron nguyên tử',
          description: 'Tìm hiểu phân bố electron trong các lớp năng lượng.',
          image: '/images/electron-shell.jpg',
        },
        {
          id: 'lesson4',
          name: 'Bài 4: Ôn tập chương 1',
          description: 'Tổng hợp kiến thức chương 1 về cấu tạo nguyên tử.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap2',
      name: 'Chương 2: Bảng tuần hoàn và định luật tuần hoàn',
      description:
        'Khám phá cấu trúc bảng tuần hoàn và xu hướng tính chất nguyên tố.',
      lessons: [
        {
          id: 'lesson5',
          name: 'Bài 5: Cấu tạo của bảng tuần hoàn các nguyên tố hóa học',
          description: 'Cách sắp xếp các nguyên tố trong bảng tuần hoàn.',
          image: '/images/periodic-table.jpg',
        },
        {
          id: 'lesson6',
          name: 'Bài 6: Xu hướng tính chất của nguyên tử trong chu kì và nhóm',
          description: 'Phân tích xu hướng biến đổi tính chất theo vị trí.',
          image: '/images/trends.jpg',
        },
        {
          id: 'lesson7',
          name: 'Bài 7: Xu hướng biến đổi thành phần và tính chất hợp chất',
          description: 'Tìm hiểu sự thay đổi trong hợp chất hóa học.',
          image: '/images/compound.jpg',
        },
        {
          id: 'lesson8',
          name: 'Bài 8: Định luật tuần hoàn và ý nghĩa bảng tuần hoàn',
          description: 'Tổng quát định luật tuần hoàn và ứng dụng.',
          image: '/images/law.jpg',
        },
        {
          id: 'lesson9',
          name: 'Bài 9: Ôn tập chương 2',
          description: 'Tổng hợp kiến thức chương 2.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap3',
      name: 'Chương 3: Liên kết hóa học',
      description:
        'Tìm hiểu các loại liên kết hóa học và lực tương tác phân tử.',
      lessons: [
        {
          id: 'lesson10',
          name: 'Bài 10: Quy tắc octet',
          description: 'Nguyên tắc sắp xếp electron trong liên kết.',
          image: '/images/octet.jpg',
        },
        {
          id: 'lesson11',
          name: 'Bài 11: Liên kết ion',
          description: 'Cách hình thành và đặc điểm của liên kết ion.',
          image: '/images/ionic.jpg',
        },
        {
          id: 'lesson12',
          name: 'Bài 12: Liên kết cộng hóa trị',
          description: 'Hiểu về cách nguyên tử chia sẻ electron.',
          image: '/images/covalent.jpg',
        },
        {
          id: 'lesson13',
          name: 'Bài 13: Liên kết hydrogen và tương tác van der Waals',
          description: 'Lực yếu giữa các phân tử và vai trò của chúng.',
          image: '/images/hbond.jpg',
        },
        {
          id: 'lesson14',
          name: 'Bài 14: Ôn tập chương 3',
          description: 'Tổng hợp kiến thức chương 3.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap4',
      name: 'Chương 4: Phản ứng oxi hóa - khử',
      description: 'Giới thiệu khái niệm và ví dụ về phản ứng oxi hóa - khử.',
      lessons: [
        {
          id: 'lesson15',
          name: 'Bài 15: Phản ứng oxi hóa - khử',
          description: 'Phân tích khái niệm oxi hóa và khử.',
          image: '/images/redox.jpg',
        },
        {
          id: 'lesson16',
          name: 'Bài 16: Ôn tập chương 4',
          description: 'Tổng hợp kiến thức chương 4.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap5',
      name: 'Chương 5: Năng lượng hóa học',
      description: 'Tìm hiểu về biến thiên năng lượng trong phản ứng hoá học.',
      lessons: [
        {
          id: 'lesson17',
          name: 'Bài 17: Biến thiên enthalpy trong phản ứng hóa học',
          description: 'Hiểu về phản ứng thu và tỏa nhiệt.',
          image: '/images/enthalpy.jpg',
        },
        {
          id: 'lesson18',
          name: 'Bài 18: Ôn tập chương 5',
          description: 'Tổng hợp kiến thức chương 5.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap6',
      name: 'Chương 6: Tốc độ phản ứng',
      description: 'Khám phá yếu tố ảnh hưởng và khái niệm tốc độ phản ứng.',
      lessons: [
        {
          id: 'lesson19',
          name: 'Bài 19: Tốc độ phản ứng',
          description: 'Hiểu các yếu tố ảnh hưởng đến tốc độ phản ứng.',
          image: '/images/rate.jpg',
        },
        {
          id: 'lesson20',
          name: 'Bài 20: Ôn tập chương 6',
          description: 'Tổng hợp kiến thức chương 6.',
          image: '/images/review.jpg',
        },
      ],
    },
    {
      id: 'chap7',
      name: 'Chương 7: Nguyên tố nhóm halogen',
      description: 'Tìm hiểu tính chất và hợp chất của nhóm halogen.',
      lessons: [
        {
          id: 'lesson21',
          name: 'Bài 21: Nhóm halogen',
          description: 'Tổng quan về các nguyên tố nhóm halogen.',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2736.png',
        },
        {
          id: 'lesson22',
          name: 'Bài 22: Hydrogen halide. Muối halide',
          description: 'Các hợp chất chứa halogen và tính chất của chúng.',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2736.png',
        },
        {
          id: 'lesson23',
          name: 'Bài 23: Ôn tập chương 7',
          description: 'Tổng hợp kiến thức chương 7.',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2736.png',
        },
      ],
    },
  ];

  return (
    <>
      <LessonList chapters={sampleChapters} />
    </>
  );
};

export default LessonListPage;
