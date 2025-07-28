'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './LessonDetail.module.scss';
import { ILessonDetail } from '@/types/home';
import parse from 'html-react-parser';

const { Title, Paragraph } = Typography;

const relatedLessons = [
  { id: 1, name: 'Bài học 1: Mở đầu' },
  { id: 2, name: 'Bài học 2: Danh sách liên kết' },
  { id: 3, name: 'Bài học 3: Cây nhị phân' },
];
interface LessonDetailProps {
  lesson?:ILessonDetail
}
export default function LessonDetail({ lesson }: LessonDetailProps) {
    
  return (
    <div className={styles.lessonWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={2} className={styles.lessonTitle}>{lesson?.lesson_name}</Title>
          <div style={{display:'flex'}}>
              <span><strong>Ngày tạo: </strong>{lesson?.created_at} - <strong>Người tạo:</strong> {lesson?.created_by}</span> 
          </div>
          <div
            className={styles.lessonDescription}
            dangerouslySetInnerHTML={{ __html: lesson?.description || 'Không có mô tả' }}
          />
        </Card>
      </div>

      <div className={styles.rightSidebar}>
        <Title level={4} className={styles.sidebarTitle}>Bài học khác</Title>
        <List
          size="small"
          dataSource={relatedLessons}
          renderItem={(item) => (
            <List.Item className={styles.lessonItem}>
              {item.name}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
