'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './BlogDetail.module.scss';
import parse from 'html-react-parser';
import { IBlog_Get } from '@/types/blog';

const { Title } = Typography;

interface BlogDetailProps {
  blog?:IBlog_Get
}
export default function BlogDetail({ blog }: BlogDetailProps) {
    
  return (
    <div className={styles.blogWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={2} className={styles.blogTitle}>{blog?.title}</Title>
          <div style={{display:'flex'}}>
              <span><strong>Ngày tạo: </strong>{blog?.created_at} - <strong>Người tạo:</strong> {blog?.created_by}</span> 
          </div>
          <div
            className={styles.blogDescription}
            dangerouslySetInnerHTML={{ __html: blog?.description || 'Không có mô tả' }}
          />
        </Card>
      </div>

      <div className={styles.rightSidebar}>
        <Title level={4} className={styles.sidebarTitle}>Bài học khác</Title>
        {/* <List
          size="small"
          dataSource={blog}
          renderItem={(item) => (
            <List.Item className={styles.blogItem}>
              {item.blog_name}
            </List.Item>
          )}
        /> */}
      </div>
    </div>
  );
}
