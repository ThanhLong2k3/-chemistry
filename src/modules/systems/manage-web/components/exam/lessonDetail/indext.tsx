'use client';
import { ILessonDetail } from '@/types/home';
import { useEffect, useState } from 'react';
import { searchLesson } from '@/services/lesson.service';
import { Home_Api } from '@/services/home.service';
import LessonDetail from './components/LessonDetail';

interface Props {
  id: string;
}

const LessonDetailPageClient = ({ id }: Props) => {
  const [lessonDetail, setLessonDetail] = useState<ILessonDetail>();
  const [listLesson, setListLesson] = useState<ILessonDetail[]>([]);

  useEffect(() => {
    if (id) {
      GetLessonDetailById(id);
    }
  }, [id]);

  const GetLessonDetailById = async (id: string) => {
    const lessonDetailData: any = await Home_Api.getLessonDetailById(id);
    const detail = lessonDetailData?.data?.data?.[0];
    if (detail) {
      setLessonDetail(detail);
      getLessonByChapter(detail.chapter_id);
    }
  };

  const getLessonByChapter = async (chapterId: string) => {
    const data: any = await searchLesson({
      page_index: 1,
      page_size: 10,
      order_type: 'asc',
      search_content_1: null,
      search_content_2: chapterId,
      search_content_3: null,
    });
    setListLesson(data?.data || []);
  };

  return (
    <LessonDetail lesson={lessonDetail} relatedLessons={listLesson} />
  );
};

export default LessonDetailPageClient;
