'use client';

import {
  Card,
  Typography,
  List,
  Avatar,
  Input,
  Button,
  Popconfirm,
  message,
  Pagination,
} from 'antd';
import styles from './BlogDetail.module.scss';
import parse from 'html-react-parser';
import { IBlog_Get } from '@/types/blog';
import env from '@/env';
import { formatDateVN } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { BLOG_DETAIL_PATH } from '@/path';
import { useState } from 'react';
import { createComment, deleteComment } from '@/services/comment.service';
import { getAccountLogin } from '@/env/getInfor_token';
import { useNotification } from '@/components/UI_shared/Notification';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;
const { TextArea } = Input;

interface BlogDetailProps {
  blog?: any;
  listBlog?: IBlog_Get[];
  comments?: any[];
  SearchComment: () => void;
  TotalRecords: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export default function BlogDetail({
  blog,
  listBlog,
  comments,
  SearchComment,
  TotalRecords,
  pageSize = 10,
  onPageChange,
}: BlogDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const { show } = useNotification();

  const handleDetailBlog = (id: string) => {
    router.push(`${BLOG_DETAIL_PATH}/${id}`);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page, pageSize);
  };

  const handleAddComment = async () => {
    const currentAccount = getAccountLogin();
    if (!currentAccount) {
      show({
        result: 1,
        messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      });
      return;
    }
    if (!newComment.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận');
      return;
    }
    try {
      const request = {
        id: uuidv4(),
        content: newComment,
        blog_id: blog?.id,
        created_by: currentAccount.username,
      };
      const res = await createComment(request);
      show({
        result: res.success ? 0 : 1,
        messageDone: 'Thêm bình luận thành công!',
        messageError: 'có lỗi khi thêm bình luận !',
      });
      SearchComment();
    } catch (err) {
      message.error('Lỗi khi thêm bình luận');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const currentAccount = getAccountLogin();
      if (!currentAccount) {
        show({
          result: 1,
          messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
        return;
      }
      const res = await deleteComment({
        id,
        deleted_by: currentAccount.username,
      });
      if (res.success) {
        show({
          result: 0, // Mã thành công
          messageDone: 'Xóa bình luận thành công!',
        });
        SearchComment(); // Tải lại dữ liệu
      } else {
        // Trường hợp API trả về success: false nhưng không ném lỗi
        show({
          result: 1,
          messageError: res.message || 'Có lỗi xảy ra!',
        });
      }
    } catch (err) {
      message.error('Lỗi khi xóa bình luận');
    }
  };

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
              {blog?.created_by_name}  - <strong>Lượt xem:</strong>{' '}
              {blog?.views} 
            </span>
          </div>
          <div
            className={styles.blogDescription}
            dangerouslySetInnerHTML={{
              __html: blog?.description || 'Không có mô tả',
            }}
          />
        </Card>

        {/* Comment Section */}
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Bình luận</Title>

          {/* Nhập comment mới */}
          <div style={{ marginBottom: 16 }}>
            <TextArea
              rows={3}
              placeholder="Nhập bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={handleAddComment}
            >
              Gửi bình luận
            </Button>
          </div>

          {/* Danh sách comment */}
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key={index}
                    title="Xóa bình luận này?"
                    onConfirm={() => handleDeleteComment(item.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <a>Xóa</a>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.author_image
                          ? `${env.BASE_URL}${item.author_image}`
                          : '/image/default_avatar.png'
                      }
                    />
                  }
                  title={
                    <div>
                      <strong style={{ fontSize: '15px' }}>
                        {item.author_name}
                      </strong>{' '}
                      <span style={{ color: '#888', fontSize: 12 }}>
                        {formatDateVN(item.created_at)}
                      </span>
                    </div>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </Card>
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

      <div className={styles.rightSidebar}>
        <Title level={4} className={styles.sidebarTitle}>
          BÀI VIẾT KHÁC
        </Title>
        <List
          size="small"
          dataSource={listBlog}
          renderItem={(item) => (
            <List.Item
              className={styles.blogItem}
              onClick={() => handleDetailBlog(item.id)}
            >
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
