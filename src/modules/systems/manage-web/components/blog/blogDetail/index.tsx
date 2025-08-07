'use client';
import BlogDetail from '@/modules/systems/manage-web/components/blog/blogDetail/components/BlogDetail';
import { searchBlog } from '@/services/blog.service';
import { Home_Api } from '@/services/home.service';
import { IBlog_Get } from '@/types/blog';
import { useEffect, useState } from 'react';

interface Props {
  id: string;
}

const BlogDetailPageClient = ({ id }: Props) => {
  const [blogDetail, setBlogDetail] = useState<IBlog_Get>();
  const [listBlog, setListBlog] = useState<IBlog_Get[]>([]);
  useEffect(() => {
    GetListBlog();
    document.title = 'Chi tiết bài viết';
    if (id) {
      GetBlogDetailById(id);
    }
  }, [id]);
  
  const GetListBlog = async () => {
      const data: any = await searchBlog({
            page_index: 1,
            page_size: 10,
            order_type: "ASC"
          });
          setListBlog(data.data || []);
  }
  const GetBlogDetailById = async (id: string) => {
    const blogDetailData: any = await Home_Api.getBlogById(id);
    setBlogDetail(blogDetailData.data.data[0]);
    
  };

  return <BlogDetail blog={blogDetail} listBlog={listBlog}/>;
};

export default BlogDetailPageClient;
