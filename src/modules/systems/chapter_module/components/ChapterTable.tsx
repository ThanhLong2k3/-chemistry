import { Card, Flex, type TableColumnsType, Table, Input, Tag, Select } from 'antd';

import { useEffect, useState } from 'react';
import { searchChapter } from '@/services/chapter.service';
import { IChapter } from '@/types/chapter';
import { ChapterModal } from './ChapterModal';
import { ChapterDelete } from './ChapterDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';

export const ChapterTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameChapter, setNameChapter] = useState<string | null>(null);
  const [listChapter, setListChapter] = useState<IChapter[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);


  // Lấy danh sách Môn học (chỉ một lần)
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await searchSubject({ page_index: 1, page_size: 1000 });
        if (res.success) setSubjects(res.data);
      } catch (err) {
        console.error('Lỗi khi tải môn học:', err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    getAllChapter();
  }, [pageIndex, pageSize, ordertype, nameChapter, selectedSubject]);

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
        search_content_1: nameChapter,
        search_content_2: selectedSubject,
      });
      settotal(data.data.length > 0 ? data.data[0].TotalRecords : 0);
      setListChapter(data.data || []);
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
          <ChapterModal row={record} getAll={getAllChapter} />
          {currentAccount ? (<ChapterDelete id={record.id} deleted_by={currentAccount?.username} getAllChapter={getAllChapter} />) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        {/* SELECT MÔN HỌC */}
        <Select
          placeholder="Môn học"
          style={{ width: 500 }}
          onChange={(value) => setSelectedSubject(value || null)}
          allowClear
          showSearch
          optionFilterProp="children"
          loading={loadingSubjects}
          value={selectedSubject}
        >
          {subjects.map(subject => (
            <Select.Option key={subject.id} value={subject.name}>
              {subject.name}
            </Select.Option>
          ))}
        </Select>

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
