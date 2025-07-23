import React, { useRef, useState, useEffect } from 'react';
import { Button, Typography, Badge } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './blog.module.scss';

const { Title } = Typography;

const BlogItem = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const blogData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
      title: 'Hướng dẫn học React cho người mới bắt đầu',
      date: '15 Dec 2024',
      views: 1250,
      category: 'Frontend',
      isNew: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      title: 'Tối ưu hóa hiệu suất ứng dụng web',
      date: '12 Dec 2024',
      views: 890,
      category: 'Performance',
      isNew: false
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      title: 'Thiết kế UI/UX hiện đại',
      date: '10 Dec 2024',
      views: 2100,
      category: 'Design',
      isNew: true
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
      title: 'JavaScript ES6+ và các tính năng mới',
      date: '08 Dec 2024',
      views: 1580,
      category: 'JavaScript',
      isNew: false
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      title: 'Quản lý state với Redux Toolkit',
      date: '05 Dec 2024',
      views: 940,
      category: 'State Management',
      isNew: false
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      title: 'Responsive Design với CSS Grid',
      date: '03 Dec 2024',
      views: 1670,
      category: 'CSS',
      isNew: false
    }
  ];


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
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
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
          className={`${styles.navButton} ${styles.navLeft} ${!canScrollLeft ? styles.disabled : ''}`}
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
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.blogImageWrapper}>
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className={styles.blogImage}
                />
                <div className={styles.imageOverlay}>
                  <Badge 
                    count={blog.category}
                    style={{ 
                      backgroundColor: '#1890ff',
                      fontSize: '11px',
                      fontWeight: 500
                    }}
                  />
                  {blog.isNew && (
                    <Badge 
                      count="NEW"
                      style={{ 
                        backgroundColor: '#ff4d4f',
                        fontSize: '10px',
                        fontWeight: 600,
                        marginLeft: '8px'
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
                    {blog.date}
                  </span>
                  <span className={styles.metaItem}>
                    <EyeOutlined className={styles.metaIcon} />
                    {formatViews(blog.views)}
                  </span>
                </div>
              </div>
              
              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </div>

        <Button 
          className={`${styles.navButton} ${styles.navRight} ${!canScrollRight ? styles.disabled : ''}`}
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