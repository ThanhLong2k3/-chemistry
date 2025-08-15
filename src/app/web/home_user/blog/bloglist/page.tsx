'use client';

import BlogList from '@/modules/systems/manage-web/components/blog/blogList/page';
import { searchBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { useEffect, useState } from 'react';

const BlogListPage = () => {
  const [blogData, setBlogData] = useState<IBlog[]>([]);

  const GetBlog = async (page_index?:number, page_size?:number) => {
    const blog: any = await searchBlog({ page_index: page_index?page_index:1, page_size: page_size?page_size:8 });
    setBlogData(blog?.data || []);
  };

  useEffect(() => {
    document.title = 'Danh sách bài viết';
    GetBlog();
  }, []);

  return (
    <BlogList
      blogData={blogData}
      TotalRecords={blogData[0]?.TotalRecords || 0}
      pageSize={8}
      onPageChange={(page, pageSize) => {
        GetBlog(page, pageSize);
      }}
    />
  );
};

export default BlogListPage;
