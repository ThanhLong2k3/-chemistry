'use client';
import ViewFlipBookPageClient from "@/modules/systems/manage-web/components/viewflipbook";
import { useSearchParams } from "next/navigation";


const ViewFlipBookPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type=searchParams.get('type');
  if (!id) {
    return <div>Không tìm thấy ID môn học</div>;
  }
  if (!type) {
    return <div>Không tìm thấy loại sách</div>;
  }
  return <ViewFlipBookPageClient id={id} typebook={type} />;
};

export default ViewFlipBookPage;
