'use client';
import LessonList from '@/modules/systems/manage-web/components/LessonList/LessonListpage';
import { useParams } from 'next/navigation';
import LessonDetail from '../../../../../modules/systems/manage-web/components/lessonDetail/LessonDetail';
import { ILessonDetail } from '@/types/home';
import { useEffect, useState } from 'react';
import { Home_Api } from '@/libs/api/home.api';

const LessonDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const [lessonDetail, setLessonDetail] = useState<ILessonDetail>();

  useEffect(() => {
    if (id) {
      GetLessonDetailById(id as string);
    }
  }, [id]);
  const GetLessonDetailById = async (id: string) => {
    const lessonDetailData: any = await Home_Api.getLessonDetailById(id);
    setLessonDetail(lessonDetailData.data.data[0]);
    console.log(lessonDetailData.data.data[0]);
  };
  return (
    <>
      <LessonDetail lesson={lessonDetail}  />
    </>
  );
};

export default LessonDetailPage;
