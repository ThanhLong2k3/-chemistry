'use client';
import ExamListPageClient from '@/modules/systems/manage-web/components/exam/examList';
import { useSearchParams } from 'next/navigation';


const LessonListPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
    if (!id) {
    return <div>Không tìm thấy ID môn học</div>;
  }

  return <ExamListPageClient id={id} />;
};

export default LessonListPage;
