'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import styles from './ExamList.module.scss';
import { useRouter } from 'next/navigation';
import { REVIEW_FILE_PDF_PATH } from '@/path';
import { IExam } from '@/types/exam';
import env from '@/env';

const { Title } = Typography;

interface ExamListProps {
  exams: IExam[];
}

// Dữ liệu giả định sẽ được sử dụng khi mảng exams rỗng
const mockExams: IExam[] = [
  {
    id: 'mock-1',
    name: 'Đề thi giữa kỳ I - Môn Hóa học 10',
    subject_id: 'sub-101',
    file: 'exam-10-1.pdf',
    description: 'Đề thi thử giữa kỳ I, gồm 25 câu trắc nghiệm. Thời gian làm bài: 45 phút.',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
    updated_by: 'admin',
    deleted: false,
  },
  {
    id: 'mock-2',
    name: 'Đề thi cuối kỳ II - Môn Hóa học 11',
    subject_id: 'sub-102',
    file: 'exam-11-2.pdf',
    description: 'Tổng hợp kiến thức cuối kỳ II, bao gồm các chương: Ancol, Phenol, Amin.',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
    updated_by: 'admin',
    deleted: false,
  },
  {
    id: 'mock-3',
    name: 'Đề thi thử THPT Quốc gia - Môn Hóa',
    subject_id: 'sub-103',
    file: 'exam-thpt-qg.pdf',
    description: 'Đề thi bám sát cấu trúc đề thi chính thức của Bộ GD&ĐT. Có đáp án chi tiết.',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
    updated_by: 'admin',
    deleted: false,
  },
];

const ExamList: React.FC<ExamListProps> = ({ exams }) => {
  const router = useRouter();

  const handleExamClick = (fileName: string) => {
    router.push(`${env.BASE_URL}${fileName}`);
  };

  // Sử dụng dữ liệu giả định nếu exams rỗng
  const displayExams = exams && exams.length > 0 ? exams : mockExams;

  return (
    <div className={styles.lessonListWrapper}>
      <Title level={2} className={styles.pageTitle}>Danh sách đề thi</Title>
      <div className={styles.examCards}>
        {displayExams.map((exam) => (
          <Card
            key={exam.id}
            hoverable
            className={styles.examCard}
            onClick={() => handleExamClick(exam.file)} 
          >
            <Card.Meta
              title={exam.name}
              description={exam.description}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamList;