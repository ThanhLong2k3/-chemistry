import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchChapter } from '@/services/chapter.service';
import { IChapter } from '@/types/chapter';
import { ChapterModal } from './ChapterModal';
import { ChapterDelete } from './ChapterDelete';
import { getAccountLogin } from '@/helpers/auth/auth.helper';
import { IDecodedToken } from '@/types/decodedToken';

export const ChapterTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameChapter, setNameChapter] = useState<string | null>(null);
  const [listChapter, setListChapter] = useState<IChapter[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  useEffect(() => {
    getAllChapter();
  }, [pageIndex, pageSize, ordertype, nameChapter]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllChapter = async () => {
    try {
      const data: any = await searchChapter({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content: nameChapter,
      });
      settotal(data.data[0]?.TotalRecords);
      setListChapter(data.data || []);
    } catch (err) {
      console.error('Failed to fetch Chapter list:', err);
    }
  };

  const columns: TableColumnsType<IChapter> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên chương',
      width: 200,
      dataIndex: 'name',
    },
    {
      title: 'Tên môn học',
      width: 80,
      dataIndex: 'subject_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 100,
      render: (html: string) => (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis', //khi bị tràn, thay vì ẩn hoàn toàn thì hiển thị ....
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <ChapterModal row={record} getAll={getAllChapter} />
          {currentAccount ? (<ChapterDelete id={record.id} deleted_by={currentAccount?.username} getAllChapter={getAllChapter} />) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm chương..."
          value={nameChapter ?? ''}
          onChange={(e) => setNameChapter(e.target.value)}
          allowClear
        />
        <ChapterModal isCreate getAll={getAllChapter} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listChapter}
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
