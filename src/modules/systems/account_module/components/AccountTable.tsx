import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchAccount } from '@/services/account.service';
import { IAccount } from '@/types/account';
import { AccountModal } from './AccountModal';
import { AccountDelete } from './AccountDelete';
import { getAccountLogin } from '@/helpers/auth/auth.helper';


export const AccountTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [UserName, setUserName] = useState<string | null>(null);
  const [listAccount, setListAccount] = useState<IAccount[]>([]);
  const [total, settotal] = useState<number>(10);
  useEffect(() => {
    getAllAccount();
  }, [pageIndex, pageSize, ordertype, UserName]);

  const getAllAccount = async () => {
    try {
      const data: any = await searchAccount({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content: UserName,
      });
      settotal(data.data[0]?.TotalRecords);
      setListAccount(data.data || []);
    } catch (err) {
      console.error('Failed to fetch Account list:', err);
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
      width: 80,
      dataIndex: 'image',
      align: 'center',

      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Avatar"
          style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: '50%' }}
        />
      ),
    },
    {
      title: 'Tên tài khoản',
      width: 100,
      dataIndex: 'username',
    },
    {
      title: 'Tên người dùng',
      width: 120,
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 120,
    },
    {
      title: 'Quyền',
      width: 70,
      dataIndex: 'role',
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
          placeholder="Nhập tên"
          value={UserName ?? ''}
          onChange={(e) => setUserName(e.target.value)}
          allowClear
        />
        <AccountModal isCreate getAll={getAllAccount} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listAccount}
        loading={false}
        scroll={{ x: 0, y: 380 }}
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
