import BlogDetailPageClient from '@/modules/systems/manage-web/components/blog/blogDetail';
import { searchBlog } from '@/services/blog.service';

export async function generateStaticParams() {
  const res: any = await searchBlog({
    page_index: 1,
    page_size: 1000000, // đủ lớn là được
    order_type: 'ASC',
  });

  const blogs = res?.data || [];

  return blogs.length ? blogs.map((blog: any) => ({
    id: blog.id.toString(),
  })) : [{id: 'exam'}]; // fallback nếu không có blog nào
}

interface Props {
  params: { id: string };
}

const BlogDetailPage = ({ params }: Props) => {
  const id = params.id;

  return <BlogDetailPageClient id={id} />;
};

export default BlogDetailPage;
