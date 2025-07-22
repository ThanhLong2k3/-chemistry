import { Card, Flex, type TableColumnsType, Table, Input, Tag, Select } from 'antd';

import { useEffect, useState } from 'react';
import { searchLesson } from '@/services/lesson.service';
import { ILesson } from '@/types/lesson';
import { LessonModal } from './LessonModal';
import { LessonDelete } from './LessonDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { ISubject } from '@/types/subject';
import { IChapter } from '@/types/chapter';
import { searchSubject } from '@/services/subject.service';
import { searchChapter } from '@/services/chapter.service';
import { showSessionExpiredModal } from '@/utils/session-handler';
import axios from 'axios';

export const LessonTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameLesson, setNameLesson] = useState<string | null>(null);
  const [listLesson, setListLesson] = useState<ILesson[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [chapters, setChapters] = useState<IChapter[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [searchNameChapter, setSearchNameChapter] = useState<string | null>(null);

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

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

  // Lấy danh sách Chương mỗi khi Môn học được chọn thay đổi
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubject) return;

      setLoadingChapters(true);
      try {
        const res = await searchChapter({
          page_index: 1,
          page_size: 10,
          search_content_1: searchNameChapter,
          search_content_2: selectedSubject,
        });
        if (res.success) setChapters(res.data);
      } catch (err) {
        console.error('Lỗi khi tải chương:', err);
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [searchNameChapter, selectedSubject]);


  useEffect(() => {
    getAllLesson();
  }, [pageIndex, pageSize, ordertype, nameLesson, selectedSubject, selectedChapter]);

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
        search_content_1: nameLesson,
        search_content_2: selectedChapter,
        search_content_3: selectedSubject
      });
      settotal(data.data.length > 0 ? data.data[0].TotalRecords : 0);
      setListLesson(data.data || []);
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

  const handleSubjectChange = (value: string | undefined) => {
    setSelectedSubject(value || null);
    setSelectedChapter(null); // Reset lựa chọn chương khi đổi môn
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
        {/* SELECT MÔN HỌC */}
        <Select
          placeholder="Chọn môn học"
          style={{ width: 300 }}
          onChange={handleSubjectChange}
          allowClear
          loading={loadingSubjects}
          value={selectedSubject}
        >
          {subjects.map(subject => (
            <Select.Option key={subject.id} value={subject.name}>
              {subject.name}
            </Select.Option>
          ))}
        </Select>

        {/* SELECT CHƯƠNG */}
        <Select
          placeholder="Chọn chương"
          style={{ width: 1000 }}
          onChange={(value) => setSelectedChapter(value || null)}
          onSearch={(value) => setSearchNameChapter(value || null)}
          showSearch
          allowClear
          loading={loadingChapters}
          disabled={!selectedSubject} // Chỉ bật khi đã chọn môn
          value={selectedChapter}
        >
          {chapters.map(chapter => (
            <Select.Option key={chapter.id} value={chapter.name}>
              {chapter.name}
            </Select.Option>
          ))}
        </Select>

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
