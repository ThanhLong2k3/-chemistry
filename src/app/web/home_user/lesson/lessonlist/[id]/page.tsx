'use client';
import LessonList from '@/modules/systems/manage-web/components/LessonList/LessonListpage';
import { Home_Api } from '@/services/home.service';
import { IChapter_Home } from '@/types/home';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const LessonListPage = () => {
  const params = useParams();
  const id = params?.id;
  const [Chapter_Subject, setChapter_Subject] = useState<IChapter_Home[]>([]);

  useEffect(() => {
    if (id) {
      GetChapterSubhectByIdSubject(id as string);
    }
  }, [id]);

  const GetChapterSubhectByIdSubject = async (id: string) => {  
    const Lesson_Subject: any = await Home_Api.GetChapterSubhectByIdSubject(id);
    const normalizedData = Lesson_Subject.data.data.map((chapter:any) => ({
      ...chapter,
      lessons: chapter.lessons ?? [], 
    }));
    setChapter_Subject(normalizedData);
  };

  return (
    <>
      <LessonList chapters={Chapter_Subject} />
    </>
  );
};

export default LessonListPage;
