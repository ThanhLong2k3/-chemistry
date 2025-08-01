'use client';

import React from 'react';
import { Collapse, Card, Typography, Image } from 'antd';
import styles from './LessonList.module.scss';
import { IChapter_Home } from '@/types/home';
import { useRouter } from 'next/navigation';
import { LESSON_DETAIL_PATH } from '@/path';
import env from '@/env';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface LessonListProps {
  chapters: IChapter_Home[];
}

const LessonList: React.FC<LessonListProps> = ({ chapters }) => {
  const router = useRouter();

  const handleLessonClick = (lessonId: string) => {
    router.push(`${LESSON_DETAIL_PATH}/${lessonId}`);
  };

  return (
    <div className={styles.lessonListWrapper}>
      <Title level={2} className={styles.pageTitle}>Danh sách bài học</Title>
      <Collapse style={{ width: '80%', margin: 'auto' }}>
        {chapters.map((chapter) => (
          <Panel header={chapter.chapter_name} key={chapter.chapter_id}>
            {chapter.chapter_description && (
              <Paragraph className={styles.chapterDesc}>{chapter.chapter_description}</Paragraph>
            )}
            <div className={styles.lessonCards}>
              {chapter.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  hoverable
                  className={styles.lessonCard}
                  onClick={() => handleLessonClick(lesson.id)} // 👈 Click để chuyển trang
                  cover={
                    lesson.image ? (
                      <Image alt={lesson.name} src={`${env.BASE_URL}${lesson.image}`} preview={false} />
                    ) : null
                  }
                >
                  <Card.Meta
                    title={lesson.name}
                    description={lesson.description?.slice(0, 100) + '...'}
                  />
                </Card>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default LessonList;
