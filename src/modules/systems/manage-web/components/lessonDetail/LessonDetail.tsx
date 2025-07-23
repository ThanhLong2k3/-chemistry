'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './LessonDetail.module.scss';

const { Title, Paragraph } = Typography;

const lesson = {
  name: 'Giới thiệu về Cấu trúc dữ liệu',
  image: '/images/lesson-cover.jpg',
  description: '<p>Đây là nội dung mô tả bài học từ quill editor, có thể chứa HTML.</p>',
  created_at:'17/07/2025',
  created_by:'Phạm Thanh Long'
};

const relatedLessons = [
  { id: 1, name: 'Bài học 1: Mở đầu' },
  { id: 2, name: 'Bài học 2: Danh sách liên kết' },
  { id: 3, name: 'Bài học 3: Cây nhị phân' },
];

export default function LessonDetail() {
    
  return (
    <div className={styles.lessonWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={2} className={styles.lessonTitle}>{lesson.name}</Title>
          <div style={{display:'flex'}}>
              <span><strong>Ngày tạo: </strong>{lesson.created_at} - <strong>Người tạo:</strong> {lesson.created_by}</span> 
          </div>
          <div
            className={styles.lessonDescription}
            dangerouslySetInnerHTML={{ __html: lesson.description }}
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
