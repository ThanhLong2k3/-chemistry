'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './LessonDetail.module.scss';
import { ILessonDetail } from '@/types/home';
import parse from 'html-react-parser';

const { Title } = Typography;

interface LessonDetailProps {
  lesson?:ILessonDetail
  relatedLessons?: any[];
}
export default function LessonDetail({ lesson,relatedLessons }: LessonDetailProps) {
    console.log('Lesson relatedLessons:', relatedLessons);
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
