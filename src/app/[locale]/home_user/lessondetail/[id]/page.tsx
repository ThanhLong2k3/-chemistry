'use client';
import LessonList from '@/modules/systems/manage-web/components/LessonList/LessonListpage';
import { useParams } from 'next/navigation';
import LessonDetail from '../../../../../modules/systems/manage-web/components/lessonDetail/LessonDetail';

const LessonDetailPage = () => {
  const params = useParams();
  const id = params?.id;

  return (
    <>
      <LessonDetail  />
    </>
  );
};

export default LessonDetailPage;
