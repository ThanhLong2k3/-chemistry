import LessonListPageClient from '@/modules/systems/manage-web/components/lesson/LessonList';
import { searchSubject } from '@/services/subject.service';

export async function generateStaticParams() {
  const res: any = await searchSubject({
    page_index: 1,
    page_size: 1000000,
    order_type: 'ASC',
  });

  const subjects = res?.data || [];

  return subjects.length ? subjects.map((subject: any) => ({
    id: subject.id.toString(),
  })) : [{id: 'exam'}];
}

interface Props {
  params: { id: string };
}

const LessonListPage = ({ params }: Props) => {
  const id = params.id;
  return <LessonListPageClient id={id} />;
};

export default LessonListPage;
