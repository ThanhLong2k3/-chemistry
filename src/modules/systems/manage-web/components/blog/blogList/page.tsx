'use client';

import React, { useState } from 'react';
import { Row, Typography, Badge, Pagination } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import styles from './BlogList.module.scss';
import HeaderTitle from '@/modules/systems/manage-web/components/header_title/header_title';
import { IBlog } from '@/types/blog';
import parse from 'html-react-parser';
import { BLOG_DETAIL_PATH } from '@/path';
import { useRouter } from 'next/navigation';
import env from '@/env';

const { Title, Text } = Typography;

interface BlogListProps {
  blogData: IBlog[];
  TotalRecords: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

const BlogList: React.FC<BlogListProps> = ({
  blogData,
  TotalRecords,
  pageSize = 6,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const isNewBlog = (createdAt: Date | string): boolean => {
    const now = new Date();
    const blogDate = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - blogDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  console.log('Blog Data trang con:', blogData);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page, pageSize);
  };

  const handleBlogClick = (id: string) => {
    router.push(`${BLOG_DETAIL_PATH}/${id}`);
  };
  return (
    <>
      <HeaderTitle title={'Danh sách bài viết'} />
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            DANH SÁCH BÀI VIẾT
          </Title>
          <Text className={styles.subtitle}>
            Danh sách các bài viết, các chủ đề để cùng nhau thảo luận và trao
            đổi kiến thức.
          </Text>
        </div>

        <Row gutter={[20, 20]} className={styles.grid}>
          {blogData.map((blog) => (
            <div
              key={blog.id}
              className={styles.blogCard}
              onClick={() => handleBlogClick(blog.id)}
            >
              <div className={styles.blogImageWrapper}>
                <img
                  src={`${env.BASE_URL}${blog.image}`}
                  alt={blog.title}
                  className={styles.blogImage}
                />
                <div className={styles.imageOverlay}>
                  {isNewBlog(blog.created_at) && (
                    <Badge
                      count="NEW"
                      style={{
                        backgroundColor: '#ff4d4f',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </div>
              </div>

              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                {blog.description && (
                  <p className={styles.blogDescription}>
                    {parse(
                      blog.description.length > 100
                        ? `${blog.description.substring(0, 100)}...`
                        : blog.description
                    )}
                  </p>
                )}
                <div className={styles.blogMeta}>
                  <span className={styles.metaItem}>
                    <CalendarOutlined className={styles.metaIcon} />
                    {formatDate(blog.created_at)}
                  </span>
                  <span className={styles.metaItem}>
                    <UserOutlined className={styles.metaIcon} />
                    {blog.created_by_name || 'Anonymous'}
                  </span>
                </div>
              </div>

              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </Row>

        {/* Pagination Control */}
        <div className={styles.paginationWrapper}>
          <Pagination
            current={currentPage}
            total={TotalRecords}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default BlogList;
