'use client';
import BlogDetail from '@/modules/systems/manage-web/components/blog/blogDetail/components/BlogDetail';
import { AddTrackView, searchBlog } from '@/services/blog.service';
import { searchComment } from '@/services/comment.service';
import { Home_Api } from '@/services/home.service';
import { IBlog_Get } from '@/types/blog';
import { IComment } from '@/types/comment';
import { useEffect, useState } from 'react';

interface Props {
  id: string;
}

const BlogDetailPageClient = ({ id }: Props) => {
  const [blogDetail, setBlogDetail] = useState<IBlog_Get>();
  const [listBlog, setListBlog] = useState<IBlog_Get[]>([]);
  const [comments, setComments] = useState<IComment[]>();
  const [TotalRecords, setTotalRecords] = useState<number>(1);

  useEffect(() => {
    GetListBlog();
    document.title = 'Chi tiết bài viết';
    if (id) {
      GetBlogDetailById(id);
      SearchComment();
      AddTrackView(id);
    }
  }, [id]);

  const SearchComment = async (page_size?:number, page_index?:number) => {
    const comment: any = await searchComment({
      page_index:page_index?page_index: 1,
      page_size: page_size?page_size:10,
      order_type: 'ASC',
      search_content_1: id,
    });
    setComments(comment.data || []);
    setTotalRecords(comment.data[0]?.TotalRecords || []);
  };
  const GetListBlog = async () => {
    const data: any = await searchBlog({
      page_index: 1,
      page_size: 10,
      order_type: 'ASC',
    });
    setListBlog(data.data || []);
  };
  const GetBlogDetailById = async (id: string) => {
    const blogDetailData: any = await Home_Api.getBlogById(id);
    setBlogDetail(blogDetailData.data.data[0]);
  };

  return (
    <BlogDetail
      blog={blogDetail}
      listBlog={listBlog}
      comments={comments}
      SearchComment={SearchComment}
      TotalRecords={TotalRecords}
      onPageChange={(page, pageSize) => {
        SearchComment(page, pageSize);
      }}
    />
  );
};

export default BlogDetailPageClient;
