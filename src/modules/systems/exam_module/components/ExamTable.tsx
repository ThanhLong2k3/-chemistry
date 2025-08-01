import { Card, Flex, type TableColumnsType, Table, Input, Tag, Select } from 'antd';

import { useEffect, useState } from 'react';
import { searchExam } from '@/services/exam.service';
import { IExam } from '@/types/exam';
import { ExamModal } from './ExamModal';
import { ExamDelete } from './ExamDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { IAccount } from '@/types/account';
import { getExamCreatedByName } from '@/services/exam.service';
import { useSearchParams } from 'next/navigation';
import { getAccountLogin } from '@/env/getInfor_token';
import env from '@/env';


export const ExamTable = () => {
  const searchParams = useSearchParams();
  const subjectFromUrl = searchParams.get('subject');

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameExam, setNameExam] = useState<string | null>(null);
  const [listExam, setListExam] = useState<IExam[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(subjectFromUrl);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [createdByName, setCreatedByName] = useState<IAccount[]>([]);
  const [selectedCreatedByName, setSelectedCreatedByName] = useState<string | null>(null);
  const [loadingCreatedByName, setLoadingCreatedByName] = useState(false);



  // Lấy danh sách tài khoản một lần khi component mount
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoadingCreatedByName(true);
      try {
        // Gọi API mới để chỉ lấy người dùng đã tạo đề kiểm tra
        const res = await getExamCreatedByName();
        if (res.success) setCreatedByName(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách người tạo đề kiểm tra:', err);
      } finally {
        setLoadingCreatedByName(false);
      }
    };
    fetchAuthors();
  }, []);

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
    getAllExam();
  }, [pageIndex, pageSize, ordertype, nameExam, selectedSubject, selectedCreatedByName]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllExam = async () => {
    try {
      const data: any = await searchExam({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: nameExam,
        search_content_2: selectedSubject,
        search_content_3: selectedCreatedByName,
      });
      settotal(data.data.length > 0 ? data.data[0].TotalRecords : 0);
      setListExam(data.data || []);
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

  const columns: TableColumnsType<IExam> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên bài kiểm tra',
      width: 150,
      dataIndex: 'name',
    },
    {
      title: 'Tên môn học',
      width: 150,
      dataIndex: 'subject_name',
    },
    {
      title: 'Bài kiểm tra',
      width: 100,
      dataIndex: 'file',
      render: (url) =>
        url ? (
          <a href={`${env.BASE_URL}${url}`} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          <div>không có</div>
        ),
    },

    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <ExamModal row={record} getAll={getAllExam} />
          {currentAccount ? (<ExamDelete id={record.id} deleted_by={currentAccount?.username} getAllExam={getAllExam} />) : null}
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

        {/* SELECT LỌC THEO NGƯỜI TẠO */}
        <Select
          placeholder="Lọc theo người đăng"
          style={{ width: 500 }}
          onChange={(value) => setSelectedCreatedByName(value || null)}
          allowClear
          showSearch
          loading={loadingCreatedByName}
          value={selectedCreatedByName}
          // Lọc dựa trên thuộc tính `label`
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          // Truyền dữ liệu vào đây
          options={createdByName.map(author => ({
            value: author.name, // Giá trị khi được chọn
            label: author.name, // Tên hiển thị và để tìm kiếm
            key: author.username // key duy nhất
          }))}
        />

        <Input
          placeholder="Nhập tên bài kiểm tra để tìm kiếm..."
          value={nameExam ?? ''}
          onChange={(e) => setNameExam(e.target.value)}
          allowClear
        />
        <ExamModal isCreate getAll={getAllExam} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listExam}
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
