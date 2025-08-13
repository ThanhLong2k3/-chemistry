import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchAccount } from '@/services/account.service';
import { IAccount } from '@/types/account';
import { AccountModal } from './AccountModal';
import { AccountDelete } from './AccountDelete';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import Image from 'next/image';
import { getAccountLogin } from '@/env/getInfor_token';
import env from '@/env';

export const AccountTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [name, setName] = useState<string | null>(null);
  const [listAccount, setListAccount] = useState<IAccount[]>([]);
  const [total, settotal] = useState<number>(10);

  //reset lại pageindex khi có dữ liệu tìm kiếm
  useEffect(() => {
    setPageIndex(1);
  }, [name]);

  useEffect(() => {
    getAllAccount();
  }, [pageIndex, pageSize, ordertype, name]);

  const getAllAccount = async () => {
    try {
      const data: any = await searchAccount({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: name,
      });
      settotal(data.data[0]?.TotalRecords);
      setListAccount(data.data || []);
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

  const currentAccount = getAccountLogin();

  const columns: TableColumnsType<IAccount> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Ảnh đại diện',
      width: 100,
      dataIndex: 'image',
      align: 'center',

      render: (imageUrl) => {
        const fullUrl = imageUrl ? `${env.BASE_URL}${imageUrl}` : '/image/default_user.jpg';
        return (
          <Image
            width={45}
            height={45}
            src={fullUrl}
            alt="Avatar"
            style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        );
      },

    },
    {
      title: 'Tên tài khoản',
      width: 100,
      dataIndex: 'username',
       ellipsis: true, 

    },
    {
      title: 'Tên người dùng',
      width: 120,
      dataIndex: 'name',
       ellipsis: true, 

    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 120,
       ellipsis: true, 

    },
    {
      title: 'Quyền',
      width: 70,
      dataIndex: 'role_name',
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <AccountModal row={record} getAll={getAllAccount} />
          {
            currentAccount ? (<AccountDelete username={record.username} deleted_by={currentAccount?.username} getAllAccount={getAllAccount} />) : (null)
          }
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập người dùng để tìm kiếm..."
          value={name ?? ''}
          onChange={(e) => setName(e.target.value.replace(/^\s+/, ''))}
          allowClear
        />
        <AccountModal isCreate getAll={getAllAccount} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listAccount}
        loading={false}
        scroll={{ x: 800, y: 380 }}
        rowKey="username"
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
