import { Card, Flex, type TableColumnsType, Table, Input, Tag, Select } from 'antd';

import { useEffect, useState } from 'react';
import { getBlogAuthors, searchBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { BlogModal } from './BlogModal';
import { BlogDelete } from './BlogDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { IAccount } from '@/types/account';
import { searchAccount } from '@/services/account.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';


export const BlogTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [titleBlog, setTitleBlog] = useState<string | null>(null);
  const [listBlog, setListBlog] = useState<IBlog[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);
  const [authors, setAuthors] = useState<IAccount[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [loadingAuthors, setLoadingAuthors] = useState(false);


  // Lấy danh sách tác giả (tài khoản) một lần khi component mount
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoadingAuthors(true);
      try {
        // Gọi API mới để chỉ lấy tác giả đã đăng bài
        const res = await getBlogAuthors();
        if (res.success) setAuthors(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách tác giả:', err);
      } finally {
        setLoadingAuthors(false);
      }
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    getAllBlog();
  }, [pageIndex, pageSize, ordertype, titleBlog, selectedAuthor]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllBlog = async () => {
    try {
      const data: any = await searchBlog({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: titleBlog,
        search_content_2: selectedAuthor,
      });
      settotal(data.data[0]?.TotalRecords);
      setListBlog(data.data || []);
    } catch (error) {
      let errorMessage = "Đã có lỗi không xác định xảy ra.";

      if (axios.isAxiosError(error)) {
        const axiosError = error;  // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      }
      else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
  };


  const columns: TableColumnsType<IBlog> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Ảnh đại diện',
      width: 80,
      dataIndex: 'image',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Avatar"
          style={{ width: 84, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tiêu đề bài viết',
      width: 100,
      dataIndex: 'title',
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    //   width: 150,
    //   render: (html: string) => (
    //     <div
    //       dangerouslySetInnerHTML={{ __html: html }}
    //       style={{
    //         maxWidth: '150px',
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis', //khi bị tràn, thay vì ẩn hoàn toàn thì hiển thị ....
    //         display: '-webkit-box',
    //         WebkitLineClamp: 2,
    //         WebkitBoxOrient: 'vertical',
    //         whiteSpace: 'normal',
    //       }}
    //     />
    //   ),
    // },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <BlogModal row={record} getAll={getAllBlog} />
          {currentAccount ? (<BlogDelete id={record.id} deleted_by={currentAccount?.username} getAllBlog={getAllBlog} />) : (null)}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        {/* SELECT LỌC THEO TÁC GIẢ */}
        <Select
          placeholder="Lọc theo người đăng"
          style={{ width: 240 }}
          onChange={(value) => setSelectedAuthor(value || null)}
          allowClear
          showSearch
          loading={loadingAuthors}
          value={selectedAuthor}
          // Lọc dựa trên thuộc tính `label`
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          // Truyền dữ liệu vào đây
          options={authors.map(author => ({
            value: author.name, // Giá trị khi được chọn
            label: author.name, // Tên hiển thị và để tìm kiếm
            key: author.username // key duy nhất
          }))}
        />

        <Input
          placeholder="Tìm kiếm bài viết..."
          value={titleBlog ?? ''}
          onChange={(e) => setTitleBlog(e.target.value)}
          allowClear
        />
        <BlogModal isCreate getAll={getAllBlog} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listBlog}
        loading={false}
        scroll={{ x: 0, y: 380 }}
        rowKey="id"
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          total: total,
          showTotal: (total) => `Tổng ${total} bản ghi`,
        }}
        onChange={(pagination) => {
          setPageIndex(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
      />
    </Card>
  );
};
