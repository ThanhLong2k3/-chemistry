import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchAdvisoryMember } from '@/services/advisory_member.service';
import { IAdvisoryMember } from '@/types/advisory_member';
import { AdvisoryMemberModal } from './AdvisoryMemberModal';
import { AdvisoryMemberDelete } from './AdvisoryMemberDelete';
import { IDecodedToken } from '@/types/decodedToken';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import Image from 'next/image';
import { getAccountLogin } from '@/env/getInfor_token';
import env from '@/env';
export const AdvisoryMemberTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameAdvisoryMember, setNameAdvisoryMember] = useState<string | null>(null);
  const [listAdvisoryMember, setListAdvisoryMember] = useState<IAdvisoryMember[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  //reset lại pageindex khi có dữ liệu tìm kiếm
  useEffect(() => {
    setPageIndex(1);
  }, [nameAdvisoryMember]);

  //lấy tài khoản để lưu created_by hoặc updated_by nếu có
  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  useEffect(() => {
    getAllAdvisoryMember();
  }, [pageIndex, pageSize, ordertype, nameAdvisoryMember]);


  const getAllAdvisoryMember = async () => {
    try {
      const data: any = await searchAdvisoryMember({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: nameAdvisoryMember,
      });
      settotal(data.data[0]?.TotalRecords);
      setListAdvisoryMember(data.data || []);
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

  const columns: TableColumnsType<IAdvisoryMember> = [
    {
      title: 'STT',
      width: 60,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên giáo viên',
      width: 160,
      dataIndex: 'teacher_name',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Ảnh đại diện',
      width: 100,
      dataIndex: 'image',
      align: 'center',
      render: (imageUrl) => (
        <Image
          width={45}
          height={45}
          src={imageUrl ? `${env.BASE_URL}${imageUrl}` : '/image/default_user.jpg'}
          alt="Avatar"
          style={{ width: '60px', height: 'auto' }}
        />
      ),
    },
    {
      title: 'Trình độ',
      width: 100,
      dataIndex: 'qualification',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Nơi công tác',
      width: 160,
      dataIndex: 'workplace',
      ellipsis: true,
    },
    {
      title: 'Số năm kinh nghiệm',
      width: 160,
      align: 'center',
      dataIndex: 'years_of_experience',
      render: (years) => {
        if (years) {
          return `${years} năm`;
        }
        return '-';
      },
    },
    {
      title: 'Thao tác',
      width: 160,
      minWidth: 160,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <AdvisoryMemberModal row={record} getAll={getAllAdvisoryMember} />
          {currentAccount ? (
            <AdvisoryMemberDelete
              id={record.id}
              deleted_by={currentAccount?.username}
              getAllAdvisoryMember={getAllAdvisoryMember}
            />
          ) : null}
        </Flex>
      ),
    },
  ];


  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên thành viên ban tư vấn để tìm kiếm..."
          value={nameAdvisoryMember ?? ''}
          onChange={(e) => setNameAdvisoryMember(e.target.value.replace(/^\s+/, ''))}
          allowClear
        />
        <AdvisoryMemberModal isCreate getAll={getAllAdvisoryMember} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listAdvisoryMember}
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
