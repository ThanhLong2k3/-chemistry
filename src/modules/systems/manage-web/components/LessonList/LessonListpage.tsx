'use client';

import React from 'react';
import { Collapse, Card, Typography, Image } from 'antd';
import styles from './LessonList.module.scss';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

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

interface LessonListProps {
  chapters: Chapter[];
}

const LessonList: React.FC<LessonListProps> = ({ chapters }) => {
  return (
    <div className={styles.lessonListWrapper}>
      <Title level={2} className={styles.pageTitle}>Danh sách bài học</Title>
      <Collapse  style={{width:'80%', margin:'auto'}}>
        {chapters.map((chapter) => (
          <Panel header={chapter.name} key={chapter.id}>
            {chapter.description && (
              <Paragraph className={styles.chapterDesc}>{chapter.description}</Paragraph>
            )}
            <div className={styles.lessonCards}>
              {chapter.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  hoverable
                  className={styles.lessonCard}
                  cover={
                    lesson.image ? (
                      <Image alt={lesson.name} src={lesson.image} preview={false} />
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
