import ExamListPageClient from '@/modules/systems/manage-web/components/exam/examList';
import { searchSubject } from '@/services/subject.service';

export async function generateStaticParams() {
  const res: any = await searchSubject({
    page_index: 1,
    page_size: 1000000,
    order_type: 'ASC',
  });

  const subjects = res?.data || [];
  console.log('subject',subjects)
  return subjects.length ? subjects.map((subject: any) => ({
    id: subject.id.toString(),
  })) : [{id: '3'}];
}

interface Props {
  params: { id: string };
}

const LessonListPage = ({ params }: Props) => {
  const id = params.id;
  return <ExamListPageClient id={id} />;
};

export default LessonListPage;
