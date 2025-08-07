'use client';

import { Card, Typography, Image, List } from 'antd';
import styles from './BlogDetail.module.scss';
import parse from 'html-react-parser';
import { IBlog_Get } from '@/types/blog';
import env from '@/env';
import { formatDateVN } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { BLOG_DETAIL_PATH } from '@/path';

const { Title } = Typography;

interface BlogDetailProps {
  blog?: IBlog_Get;
  listBlog?: IBlog_Get[];
}

export default function BlogDetail({ blog, listBlog }: BlogDetailProps) {
    const router = useRouter();
  
  const handleDetailBlog=(id:string)=>{
       router.push(`${BLOG_DETAIL_PATH}/${id}`);
  }
  return (
    <div className={styles.blogWrapper}>
      <div className={styles.leftContent}>
        <Card>
          <Title level={3} className={styles.blogTitle}>
            {blog?.title}
          </Title>
          <div style={{ display: 'flex' }}>
            <span>
              <strong>Ngày tạo: </strong>
              {formatDateVN(blog?.created_at)} - <strong>Người tạo:</strong>{' '}
              {blog?.created_by_name}
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
            <List.Item className={styles.blogItem} onClick={()=>handleDetailBlog(item.id)}>
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
