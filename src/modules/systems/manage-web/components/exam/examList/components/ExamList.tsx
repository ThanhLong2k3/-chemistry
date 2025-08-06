'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space,
  Empty,
  Tooltip,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  ClockCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import styles from './ExamList.module.scss';
import { useRouter } from 'next/navigation';
import { IExam } from '@/types/exam';
import env from '@/env';
import parse from 'html-react-parser';
import HeaderTitle from '../../../header_title/header_title';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ExamListProps {
  exams: IExam[];
}

// Dữ liệu giả định với thêm thông tin
const mockExams: IExam[] = [
  {
    id: 'mock-1',
    name: 'Đề thi giữa kỳ I - Môn Hóa học 10',
    subject_id: 'sub-101',
    file: 'exam-10-1.pdf',
    description: 'Đề thi thử giữa kỳ I, gồm <strong>25 câu trắc nghiệm</strong>. Thời gian làm bài: <em>45 phút</em>. Bao gồm các chương: Nguyên tử, Bảng tuần hoàn.',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-20'),
    created_by: 'Thầy Nguyễn Văn A',
    updated_by: 'admin',
    deleted: false,
  },
  {
    id: 'mock-2',
    name: 'Đề thi cuối kỳ II - Môn Hóa học 11',
    subject_id: 'sub-102',
    file: 'exam-11-2.pdf',
    description: 'Tổng hợp kiến thức cuối kỳ II, bao gồm các chương: <strong>Ancol, Phenol, Amin</strong>. Đề thi có <em>30 câu</em> với độ khó tăng dần.',
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-15'),
    created_by: 'Cô Trần Thị B',
    updated_by: 'admin',
    deleted: false,
  },
  {
    id: 'mock-3',
    name: 'Đề thi thử THPT Quốc gia - Môn Hóa',
    subject_id: 'sub-103',
    file: 'exam-thpt-qg.pdf',
    description: 'Đề thi bám sát cấu trúc đề thi chính thức của <strong>Bộ GD&ĐT</strong>. Có đáp án chi tiết và lời giải. <em>40 câu trắc nghiệm</em> - 90 phút.',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-10'),
    created_by: 'Ban Giám Hiệu',
    updated_by: 'admin',
    deleted: false,
  },
  {
    id: 'mock-4',
    name: 'Đề thi học kỳ I - Môn Hóa học 12',
    subject_id: 'sub-104',
    file: 'exam-12-1.pdf',
    description: 'Kiểm tra tổng hợp kiến thức học kỳ I lớp 12. Chuyên đề: <strong>Este, Lipit, Glucid, Protein</strong>.',
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-30'),
    created_by: 'Thầy Lê Văn C',
    updated_by: 'admin',
    deleted: false,
  }
];

const ExamList: React.FC<ExamListProps> = ({ exams }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const displayExams = exams && exams.length > 0 ? exams : mockExams;

  // Lọc và sắp xếp đề thi
  const filteredExams = displayExams
    .filter(exam => 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(exam => selectedSubject === 'all' || exam.subject_id === selectedSubject)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleExamClick = (fileName: string) => {
    router.push(`${env.BASE_URL}${fileName}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getSubjectTag = (subjectId: string) => {
    const subjects: { [key: string]: { name: string; color: string } } = {
      'sub-101': { name: 'Hóa 10', color: 'blue' },
      'sub-102': { name: 'Hóa 11', color: 'green' },
      'sub-103': { name: 'THPT QG', color: 'red' },
      'sub-104': { name: 'Hóa 12', color: 'orange' }
    };
    const subject = subjects[subjectId] || { name: 'Khác', color: 'default' };
    return <Tag color={subject.color}>{subject.name}</Tag>;
  };

  const handleDownload = (fileName: string, examName: string) => {
    try {
      // Tạo URL download
      const downloadUrl = `${env.BASE_URL}${fileName}`;
      
      // Tạo element a để trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName; // Tên file khi download
      link.target = '_blank'; // Mở tab mới nếu không thể download trực tiếp
      
      // Thêm vào DOM, click và xóa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Có thể thêm notification thành công ở đây
      console.log(`Đang tải xuống: ${examName}`);
    } catch (error) {
      console.error('Lỗi khi tải file:', error);
      // Fallback: mở file trong tab mới
      window.open(`${env.BASE_URL}${fileName}`, '_blank');
    }
  };
  return (
    <>
    <HeaderTitle title={"Danh sách đề thi"} />
    <div className={styles.examListWrapper}>
      
      <div className={styles.examGrid}>
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card
              key={exam.id}
              className={styles.examCard}
              hoverable
              actions={[
                <Tooltip title="Xem đề thi" key="view">
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />}
                    onClick={() => handleExamClick(exam.file)}
                    className={styles.actionBtn}
                  >
                    Xem đề
                  </Button>
                </Tooltip>,
                <Tooltip title="Tải xuống" key="download">
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />}
                     onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(exam.file, exam.name);
                    }}
                    className={styles.actionBtn}
                  >
                    Tải về
                  </Button>
                </Tooltip>
              ]}
            >
              <div className={styles.examHeader}>
                <div className={styles.examTitle}>
                  <Title level={4} className={styles.examName}>
                    {exam.name}
                  </Title>
                  {getSubjectTag(exam.subject_id)}
                </div>
              </div>

              <div className={styles.examDescription}>
                {parse(exam.description)}
              </div>

              <div className={styles.examMeta}>
                <div className={styles.metaItem}>
                  <ClockCircleOutlined className={styles.metaIcon} />
                  <Text className={styles.metaText}>
                    {formatDate(exam.created_at)}
                  </Text>
                </div>
                <div className={styles.metaItem}>
                  <Text className={styles.metaText}>
                    Tạo bởi: {exam.created_by}
                  </Text>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text>Không tìm thấy đề thi phù hợp</Text>
                  <br />
                  <Text type="secondary">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
                </div>
              }
            >
              <Button 
                type="primary" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ExamList;