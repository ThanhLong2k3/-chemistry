'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './BlogDetail.module.scss';
import parse from 'html-react-parser';
import { IBlog_Get } from '@/types/blog';
import env from '@/env';

const { Title } = Typography;

interface BlogDetailProps {
  blog?: IBlog_Get;
  listBlog?: IBlog_Get[];
}
export default function BlogDetail({ blog, listBlog }: BlogDetailProps) {
  return (
    <div className={styles.blogWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={2} className={styles.blogTitle}>
            {blog?.title}
          </Title>
          <div style={{ display: 'flex' }}>
            <span>
              <strong>Ngày tạo: </strong>
              {blog?.created_at} - <strong>Người tạo:</strong>{' '}
              {blog?.created_by}
            </span>
          </div>
          <div
            className={styles.blogDescription}
            dangerouslySetInnerHTML={{
              __html: blog?.description || 'Không có mô tả',
            }}
          />
        </Card>
      </div>

      <div className={styles.rightSidebar}>
        <Title level={4} className={styles.sidebarTitle}>
          Bài viết khác
        </Title>
        <List
          size="small"
          dataSource={listBlog}
          renderItem={(item) => (
            <List.Item className={styles.blogItem}>
              <div className={styles.blogCard}>
                <img
                  src={
                    item.image
                      ? `${env.BASE_URL}${item.image}`
                      : '/image/default_blog.png'
                  }
                  alt="Blog Image"
                  width={70}
                  height={70}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <span className={styles.blogTitle}>{item.title}</span>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
