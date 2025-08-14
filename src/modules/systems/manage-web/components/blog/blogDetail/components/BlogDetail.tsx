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
import { IBlog_Get } from '@/types/blog';
import env from '@/env';
import { formatDateVN } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { BLOG_DETAIL_PATH } from '@/path';
import { useEffect, useState } from 'react';
import { createComment, deleteComment } from '@/services/comment.service';
import { getAccountLogin } from '@/env/getInfor_token';
import { useNotification } from '@/components/UI_shared/Notification';
import { v4 as uuidv4 } from 'uuid';
import parse from 'html-react-parser';

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
  const [currentAccount, setAurrentAccount] = useState<any>(null);
  
  // Kiểm tra có comment không
  const hasComments = comments && comments.length > 0;
  
  const handleDetailBlog = (id: string) => {
    router.push(`${BLOG_DETAIL_PATH}/?id=${id}`);
  };
  
  useEffect(() => {
    const currentAccount = getAccountLogin();
    setAurrentAccount(currentAccount);
  }, []);
  
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
        messageError: 'Có lỗi khi thêm bình luận!',
      });
      setNewComment('');
      SearchComment();
    } catch (err) {
      show({
        result: 1,
        messageError: 'Vui lòng đăng nhập để thực hiện chức năng này !',
      });
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
          result: 0,
          messageDone: 'Xóa bình luận thành công!',
        });
        SearchComment();
      } else {
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
            <span style={{ fontSize: '1.25rem', color: '#808080' }}>
              <span
                style={{
                  marginRight: '20px',
                  fontSize: '1.25rem',
                  color: '#808080',
                }}
              >
                Ngày tạo: {formatDateVN(blog?.created_at)}
              </span>
              <span
                style={{
                  marginRight: '20px',
                  fontSize: '1.25rem',
                  color: '#808080',
                }}
              >
                Người tạo: {blog?.created_by_name}
              </span>
              <span style={{ fontSize: '1.25rem', color: '#808080' }}>
                Lượt xem: {blog?.views}
              </span>
            </span>
          </div>
          <div className={styles.blogDescription}>
            {parse(blog?.description || 'Không có mô tả')}
          </div>
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

          {/* Danh sách comment - chỉ hiển thị khi có comment */}
          {hasComments && (
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item, index) => {
                const isAuthorComment =
                  currentAccount?.username === item.created_by;
                const isAuthorBlog =
                  currentAccount?.username === blog?.updated_by;
                const isNameAuthorBlog =
                  currentAccount?.name === blog?.created_by_name;

                const canDelete =
                  currentAccount &&
                  (isAuthorComment || isAuthorBlog || isNameAuthorBlog);

                return (
                  <List.Item
                    actions={
                      canDelete
                        ? [
                            <Popconfirm
                              key={index}
                              title="Xóa bình luận này?"
                              onConfirm={() => handleDeleteComment(item.id)}
                              okText="Xóa"
                              cancelText="Hủy"
                            >
                              <a>Xóa</a>
                            </Popconfirm>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            item.author_image
                              ? `${env.BASE_URL}${item.author_image}`
                              : '/default-avatar.png'
                          }
                          alt="Avatar"
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
                      description={
                        <div className={styles.commentContent}>
                          {item.content}
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}

          {/* Hiển thị thông báo khi chưa có comment */}
          {!hasComments && (
            <div style={{ 
              textAlign: 'center', 
              color: '#888', 
              fontSize: '14px',
              padding: '20px 0' 
            }}>
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </div>
          )}
        </Card>

        {/* Pagination Control - chỉ hiển thị khi có comment và có nhiều hơn 1 trang */}
        {hasComments && TotalRecords > pageSize && (
          <div className={styles.paginationWrapper}>
            <Pagination
              current={currentPage}
              total={TotalRecords}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
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