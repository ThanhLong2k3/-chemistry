import React, { useRef, useState, useEffect } from 'react';
import { Button, Typography, Badge } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';
import styles from './blog.module.scss';
import { IBlog } from '@/types/blog';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';
import { BLOG_DETAIL_PATH } from '@/path';
import env from '@/env';
const { Title } = Typography;

const BlogItem = ({ blogData }: { blogData: IBlog[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();
  // Function để kiểm tra blog mới (trong vòng 7 ngày)
  const isNewBlog = (createdAt: Date | string): boolean => {
    const now = new Date();
    const blogDate = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - blogDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Function format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

        if (atEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }

        setTimeout(checkScrollButtons, 300);
      }
    }, 4000); // Auto-scroll every 4s

    return () => clearInterval(interval);
  }, []);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleBlogClick = (id: string) => {
    router.push(`${BLOG_DETAIL_PATH}/${id}`);
  }
  return (
    <div className={styles.blogContainer}>
      <div className={styles.sectionHeader}>
        <Title level={2} className={styles.sectionTitle}>
          BÀI VIẾT MỚI NHẤT
        </Title>
        <div className={styles.titleUnderline}></div>
      </div>

      <div className={styles.blogWrapper}>
        <Button
          className={`${styles.navButton} ${styles.navLeft} ${
            !canScrollLeft ? styles.disabled : ''
          }`}
          onClick={scrollLeft}
          icon={<LeftOutlined />}
          shape="circle"
          size="large"
          disabled={!canScrollLeft}
        />

        <div
          className={styles.blogScrollContainer}
          ref={scrollRef}
          onScroll={checkScrollButtons}
        >
          {blogData.map((blog) => (
            <div key={blog.id} className={styles.blogCard} onClick={()=>handleBlogClick(blog.id)}>
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
                    {parse(blog.description.length > 100
                      ? `${blog.description.substring(0, 100)}...`
                      : blog.description)}
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
        </div>

        <Button
          className={`${styles.navButton} ${styles.navRight} ${
            !canScrollRight ? styles.disabled : ''
          }`}
          onClick={scrollRight}
          icon={<RightOutlined />}
          shape="circle"
          size="large"
          disabled={!canScrollRight}
        />
      </div>
    </div>
  );
};

export default BlogItem;
