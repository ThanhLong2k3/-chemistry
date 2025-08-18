import {
  Card,
  Flex,
  type TableColumnsType,
  Table,
  Input,
  Tag,
  Select,
} from 'antd';

import { useEffect, useState } from 'react';
import { getBlogAuthors, searchBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { BlogModal } from './BlogModal';
import { BlogDelete } from './BlogDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { IAccount } from '@/types/account';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import Image from 'next/image';
import { getAccountLogin } from '@/env/getInfor_token';
import env from '@/env';

export const BlogTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // `ordertype` bây giờ sẽ quản lý cả sắp xếp theo ngày và theo lượt xem
  const [ordertype, setOrderType] = useState<string>('DESC'); // Mặc định: Mới nhất
  const [titleBlog, setTitleBlog] = useState<string | null>(null);
  const [listBlog, setListBlog] = useState<IBlog[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(
    null
  );
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

  //reset lại pageindex khi có dữ liệu tìm kiếm
  useEffect(() => {
    setPageIndex(1);
  }, [titleBlog, selectedAuthor]);

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
      let errorMessage = 'Đã có lỗi không xác định xảy ra.';

      if (axios.isAxiosError(error)) {
        const axiosError = error; // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
  };

  const columns: TableColumnsType<IBlog> = [
    {
      title: 'STT',
      width: 60,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Ảnh đại diện',
      width: 70,
      dataIndex: 'image',
      align: 'center',
      render: (imageUrl) => (
        <Image
          width={70}
          height={70}
          src={
            imageUrl ? `${env.BASE_URL}${imageUrl}` : '/image/default_blog.png'
          }
          alt="Avatar"
          style={{ height: '70px', width: 'auto' }}
        />
      ),
    },
    {
      title: 'Tiêu đề bài viết',
      width: 150,
      dataIndex: 'title',
      ellipsis: true,

      render: (title: string) =>
      (
        <span>
          {title.length > 35 ? title.substring(0, 35).trim() + '...' : title}
        </span>
      )
    },

    {
      title: 'Lượt xem',
      width: 100,
      dataIndex: 'views',
      align: 'center',
      ellipsis: true,

    },
    {
      title: 'Ngày đăng',
      width: 80,
      dataIndex: 'created_at',
      align: 'center',
      ellipsis: true,

      render: (date: string) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: 'Người đăng',
      width: 100,
      dataIndex: 'created_by_name',
      align: 'center',
      ellipsis: true,

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
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <BlogModal row={record} getAll={getAllBlog} />
          {currentAccount ? (
            <BlogDelete
              id={record.id}
              deleted_by={currentAccount?.username}
              getAllBlog={getAllBlog}
            />
          ) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Card>
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        {/* === SẮP XẾP === */}
        <Select
          defaultValue="DESC" // Giá trị mặc định
          style={{ width: 240 }}
          onChange={(value) => setOrderType(value)}
          options={[
            { value: 'DESC', label: 'Mới nhất' },
            { value: 'ASC', label: 'Cũ nhất' },
            { value: 'views_desc', label: 'Xem nhiều nhất' },
            { value: 'views_asc', label: 'Xem ít nhất' },
          ]}
        />

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
          options={authors.map((author) => ({
            value: author.name, // Giá trị khi được chọn
            label: author.name, // Tên hiển thị và để tìm kiếm
            key: author.username, // key duy nhất
          }))}
        />

        <Input
          placeholder="Nhập tiêu đề bài viết để tìm kiếm..."
          value={titleBlog ?? ''}
          onChange={(e) => setTitleBlog(e.target.value.replace(/^\s+/, ''))}
          allowClear
        />
        <BlogModal isCreate getAll={getAllBlog} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listBlog}
        loading={false}
        scroll={{ x: 'max-content', y: 380 }}
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
