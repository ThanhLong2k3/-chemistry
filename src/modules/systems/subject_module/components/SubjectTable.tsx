import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchSubject } from '@/services/subject.service';
import { ISubject } from '@/types/subject';
import { SubjectModal } from './SubjectModal';
import { SubjectDelete } from './SubjectDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';


export const SubjectTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameSubject, setNameSubject] = useState<string | null>(null);
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);


  useEffect(() => {
    getAllSubject();
  }, [pageIndex, pageSize, ordertype, nameSubject]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllSubject = async () => {
    try {
      const data: any = await searchSubject({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: nameSubject,
      });
      settotal(data.data[0]?.TotalRecords);
      setListSubject(data.data || []);
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


  const columns: TableColumnsType<ISubject> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên môn học',
      width: 100,
      dataIndex: 'name',
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
      title: 'Sách giáo khoa',
      width: 90,
      dataIndex: 'textbook',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          <div>không có</div>
        ),
    },
    {
      title: 'Sách bài tập',
      width: 90,
      dataIndex: 'workbook',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          <div>không có</div>
        ),
    },
    {
      title: 'Vở bài tập',
      width: 90,
      dataIndex: 'exercise_book',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          <div>không có</div>
        ),
    },
    {
      title: 'Đề kiểm tra',
      width: 70,
      render: (_, record) => (
        <a href={`manage_exam?subject=${encodeURIComponent(record.name)}`}>
          Xem ngay
        </a>
      )
    },
    {
      title: 'Sắp xếp',
      width: 60,
      dataIndex: 'sort_order',
      align: 'center',
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <SubjectModal row={record} getAll={getAllSubject} />
          {currentAccount ? (<SubjectDelete id={record.id} deleted_by={currentAccount?.username} getAllSubject={getAllSubject} />) : (null)}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên môn học để tìm kiếm..."
          value={nameSubject ?? ''}
          onChange={(e) => setNameSubject(e.target.value)}
          allowClear
        />
        <SubjectModal isCreate getAll={getAllSubject} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listSubject}
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
