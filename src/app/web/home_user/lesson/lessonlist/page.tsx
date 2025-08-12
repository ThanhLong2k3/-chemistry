'use client'
import LessonListPageClient from '@/modules/systems/manage-web/components/lesson/LessonList';
import { useSearchParams } from 'next/navigation';


const LessonListPage = () => {
 const searchParams = useSearchParams();
  const id = searchParams.get('id');
  if (!id) {
    return <div>Không tìm thấy ID môn học</div>;
  }
  return <LessonListPageClient id={id} />;
};

export default LessonListPage;
