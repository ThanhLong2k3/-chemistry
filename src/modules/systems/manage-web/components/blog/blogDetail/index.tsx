'use client';
import BlogDetail from '@/modules/systems/manage-web/components/blog/blogDetail/components/BlogDetail';
import { Home_Api } from '@/services/home.service';
import { IBlog_Get } from '@/types/blog';
import { useEffect, useState } from 'react';

interface Props {
  id: string;
}

const BlogDetailPageClient = ({ id }: Props) => {
  const [blogDetail, setBlogDetail] = useState<IBlog_Get>();

  useEffect(() => {
    document.title = 'Chi tiết bài viết';
    if (id) {
      GetBlogDetailById(id);
    }
  }, [id]);

  const GetBlogDetailById = async (id: string) => {
    const blogDetailData: any = await Home_Api.getBlogById(id);
    setBlogDetail(blogDetailData.data.data);
  };

  return <BlogDetail blog={blogDetail} />;
};

export default BlogDetailPageClient;
