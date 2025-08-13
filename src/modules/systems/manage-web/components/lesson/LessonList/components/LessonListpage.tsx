'use client';

import React from 'react';
import { Collapse, Card, Typography, Image } from 'antd';
import styles from './LessonList.module.scss';
import { IChapter_Home } from '@/types/home';
import { useRouter } from 'next/navigation';
import { LESSON_DETAIL_PATH } from '@/path';
import env from '@/env';
import parse from 'html-react-parser';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface LessonListProps {
  chapters: IChapter_Home[];
}

const LessonList: React.FC<LessonListProps> = ({ chapters }) => {
  const router = useRouter();

  const handleLessonClick = (lessonId: string) => {
    router.push(`${LESSON_DETAIL_PATH}/?id=${lessonId}`);
  };

  return (
    <div className={styles.lessonListWrapper}>
      <Title level={2} className={styles.pageTitle}>
        DANH SÁCH BÀI HỌC
      </Title>
      <Collapse className={styles.Collapse}>
        {chapters.map((chapter) => (
          <Panel
            header={
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {chapter.chapter_name}
              </span>
            }
            key={chapter.chapter_id}
          >
            <div className={styles.lessonCards}>
              {chapter.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  hoverable
                  className={styles.lessonCard}
                  onClick={() => handleLessonClick(lesson.id)} // 👈 Click để chuyển trang
                  cover={
                    <Image
                      alt={lesson.name}
                      height={250}
                      src={
                        lesson.image
                          ? `${env.BASE_URL}${lesson.image}`
                          : '/default.png'
                      }
                      preview={false}
                    />
                  }
                >
                  <Card.Meta title={lesson.name} />
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
