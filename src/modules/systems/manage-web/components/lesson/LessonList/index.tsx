'use client';
import { Home_Api } from '@/services/home.service';
import { IChapter_Home } from '@/types/home';
import { useEffect, useState } from 'react';
import LessonList from './components/LessonListpage';

interface Props {
  id: string;
}

const LessonListPageClient = ({ id }: Props) => {
  const [Chapter_Subject, setChapter_Subject] = useState<IChapter_Home[]>([]);

  useEffect(() => {
    if (id) {
      GetChapterSubjectById(id);
    }
  }, [id]);

  const GetChapterSubjectById = async (id: string) => {
    const Lesson_Subject: any = await Home_Api.GetChapterSubhectByIdSubject(id);
    const normalizedData = Lesson_Subject.data.data.map((chapter: any) => ({
      ...chapter,
      lessons: chapter.lessons ?? [],
    }));
    setChapter_Subject(normalizedData);
  };

  return <LessonList chapters={Chapter_Subject} />;
};

export default LessonListPageClient;
