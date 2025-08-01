import LessonDetailPageClient from '@/modules/systems/manage-web/components/lesson/lessonDetail/indext';
import { searchLesson } from '@/services/lesson.service';

export async function generateStaticParams() {
    console.log('generateStaticParams is running');
  const res: any = await searchLesson({
    page_index: 1,
    page_size: 1000000,
    order_type: 'ASC',
  });

  const lessons = res?.data || [];

  return lessons.length ? lessons.map((lesson: any) => ({
    id: lesson.id.toString(),
  })) : [{id: 'exam'}];
}

interface Props {
  params: { id: string };
}

const LessonDetailPage = ({ params }: Props) => {
  const id = params.id;
  return <LessonDetailPageClient id={id} />;
};

export default LessonDetailPage;
