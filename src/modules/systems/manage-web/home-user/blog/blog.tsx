import React, { useRef, useState, useEffect } from 'react';
import { Button, Typography, Badge } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './blog.module.scss';
import { IBlog } from '@/types/blog';
import { useRouter } from 'next/navigation';
import { BLOG_DETAIL_PATH } from '@/path';
import env from '@/env';

const { Title } = Typography;

const BlogItem = ({ blogData }: { blogData: IBlog[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();

  // Kiểm tra blog mới trong 7 ngày
  const isNewBlog = (createdAt: Date | string): boolean => {
    const now = new Date();
    const blogDate = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - blogDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Format ngày
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Tính khoảng scroll theo kích thước thực tế
  const getScrollAmount = () => {
    const container = scrollRef.current;
    const card = container?.querySelector(`.${styles.blogCard}`) as HTMLElement;
    const cardWidth = card?.offsetWidth || 320;
    const gap = 24;
    return cardWidth + gap;
  };

  // Hàm scroll theo hướng
  const scrollByDirection = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = getScrollAmount();
    const scrollValue = direction === 'right' ? scrollAmount : -scrollAmount;

    container.scrollBy({ left: scrollValue, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  };

  const scrollLeft = () => scrollByDirection('left');
  const scrollRight = () => scrollByDirection('right');

  // Kiểm tra trạng thái scroll
  const checkScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // trừ 5 tránh lỗi float
  };

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

      if (atEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollAmount = getScrollAmount();
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }

      setTimeout(checkScrollButtons, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Lắng nghe resize
  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBlogClick = (id: string) => {
    router.push(`${BLOG_DETAIL_PATH}/${id}`);
  };

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
            <div
              key={blog.id}
              className={styles.blogCard}
              onClick={() => handleBlogClick(blog.id)}
            >
              <div className={styles.blogImageWrapper}>
                <img
                  src={
                    blog.image ? `${env.BASE_URL}${blog.image}` : '/default.png'
                  }
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
