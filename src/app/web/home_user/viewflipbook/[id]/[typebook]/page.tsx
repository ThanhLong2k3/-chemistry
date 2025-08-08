import ViewFlipBookPageClient from "@/modules/systems/manage-web/components/viewflipbook";
import { searchSubject } from "@/services/subject.service";

export async function generateStaticParams() {
  const res: any = await searchSubject({
    page_index: 1,
    page_size: 1000000,
    order_type: 'ASC',
  });

  const subjects = res?.data || [];

  const params: { id: string; typebook: string }[] = [];

  subjects.forEach((subject: any) => {
    const id = subject.id.toString();

    // Tạo 3 route tĩnh cho mỗi subject
    params.push({ id, typebook: 'SGK' });
    params.push({ id, typebook: 'SBT' });
    params.push({ id, typebook: 'VBT' });
  });

  // Nếu không có subject nào, tạo 1 route fallback
  if (params.length === 0) {
    params.push({ id: 'exam', typebook: 'SGK' });
    params.push({ id: 'exam', typebook: 'SBT' });
    params.push({ id: 'exam', typebook: 'VBT' });
  }

  return params;
}

interface Props {
  params: { id: string; typebook: string };
}

const ViewFlipBookPage = ({ params }: Props) => {
  const { id, typebook } = params;
  return <ViewFlipBookPageClient id={id} typebook={typebook} />;
};

export default ViewFlipBookPage;
