'use client';
import LessonList from '@/modules/systems/manage-web/components/LessonList/LessonListpage';
import { useParams } from 'next/navigation';
import { ILessonDetail } from '@/types/home';
import { useEffect, useState } from 'react';
import { searchLesson } from '@/services/lesson.service';
import LessonDetail from '@/modules/systems/manage-web/components/lessonDetail/LessonDetail';
import { Home_Api } from '@/services/home.service';

const LessonDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const [lessonDetail, setLessonDetail] = useState<ILessonDetail>();
  const [listLesson, setListLesson] = useState<ILessonDetail[]>([]);
  useEffect(() => {
    if (id) {
      GetLessonDetailById(id as string);
    }
  }, [id]);

  const GetLessonDetailById = async (id: string) => {
    const lessonDetailData: any = await Home_Api.getLessonDetailById(id);
    setLessonDetail(lessonDetailData.data.data[0]);
    getLessonByChapter(lessonDetailData.data.data[0].chapter_id);

    console.log(lessonDetailData.data.data[0]);
  };

  const getLessonByChapter = async (id: string) => {
    const data: any = await searchLesson({
      page_index: 1,
      page_size: 10,
      order_type: 'asc',
      search_content_1: null,
      search_content_2: id,
      search_content_3: null,
    });
    setListLesson(data.data || []);
  };

  return (
    <>
      <LessonDetail lesson={lessonDetail} relatedLessons={listLesson} />
    </>
  );
};

export default LessonDetailPage;
