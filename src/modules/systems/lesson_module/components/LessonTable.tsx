import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchLesson } from '@/services/lesson.service';
import { ILesson } from '@/types/lesson';
import { LessonModal } from './LessonModal';
import { LessonDelete } from './LessonDelete';
import { getAccountLogin } from '@/helpers/auth/auth.helper';
import { IDecodedToken } from '@/types/decodedToken';

export const LessonTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameLesson, setNameLesson] = useState<string | null>(null);
  const [listLesson, setListLesson] = useState<ILesson[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  useEffect(() => {
    getAllLesson();
  }, [pageIndex, pageSize, ordertype, nameLesson]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllLesson = async () => {
    try {
      const data: any = await searchLesson({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content: nameLesson,
      });
      settotal(data.data[0]?.TotalRecords);
      setListLesson(data.data || []);
    } catch (err) {
      console.error('Failed to fetch Lesson list:', err);
    }
  };

  const columns: TableColumnsType<ILesson> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên bài học',
      width: 200,
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
          style={{ height: 60, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên chương',
      width: 200,
      dataIndex: 'chapter_name',
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    //   width: 100,
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
          <LessonModal row={record} getAll={getAllLesson} />
          {currentAccount ? (<LessonDelete id={record.id} deleted_by={currentAccount?.username} getAllLesson={getAllLesson} />) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm bài học..."
          value={nameLesson ?? ''}
          onChange={(e) => setNameLesson(e.target.value)}
          allowClear
        />
        <LessonModal isCreate={true} getAll={getAllLesson} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listLesson}
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
