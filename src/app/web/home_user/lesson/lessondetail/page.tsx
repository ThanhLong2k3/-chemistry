'use client';
import LessonDetailPageClient from '@/modules/systems/manage-web/components/lesson/lessonDetail/indext';
import { useSearchParams } from 'next/navigation';

const LessonDetailPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  if (!id) {
    return <div>Không tìm thấy ID bài học</div>;
  }
  return <LessonDetailPageClient id={id} />;
};

export default LessonDetailPage;
