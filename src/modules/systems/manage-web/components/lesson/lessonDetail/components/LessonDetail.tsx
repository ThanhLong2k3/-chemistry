'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './LessonDetail.module.scss';
import { ILessonDetail } from '@/types/home';
import parse from 'html-react-parser';
import { formatDateVN } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { LESSON_DETAIL_PATH } from '@/path';

const { Title } = Typography;

interface LessonDetailProps {
  lesson?:ILessonDetail
  relatedLessons?: any[];
}
export default function LessonDetail({ lesson,relatedLessons }: LessonDetailProps) {
  const router = useRouter();  
  console.log('Lesson relatedLessons:', relatedLessons);
  const handleDetailLesson=(id:string)=>{
         router.push(`${LESSON_DETAIL_PATH}/${id}`);
    }
  return (
    <div className={styles.lessonWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={3} className={styles.lessonTitle}>{lesson?.lesson_name}</Title>
          <div style={{display:'flex'}}>
              <span><strong>Ngày tạo: </strong>{formatDateVN(lesson?.created_at)} - <strong>Người tạo:</strong> {lesson?.created_by_name}</span> 
          </div>
          <div
            className={styles.lessonDescription}
            dangerouslySetInnerHTML={{ __html: lesson?.description || 'Không có mô tả' }}
          />
        </Card>
      </div>

      <div className={styles.rightSidebar}>
        <Title level={3} className={styles.sidebarTitle}>Bài học khác</Title>
        <List
          size="small"
          dataSource={relatedLessons}
          renderItem={(item) => (
            <List.Item className={styles.lessonItem} onClick={()=>handleDetailLesson(item.id)}>
              {item.name}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
