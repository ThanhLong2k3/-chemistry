import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchUser } from '@/services/user.service';
import { IUser } from '@/types/user';
import { UserModal } from './UserModal';
import { UserDelete } from './UserDelete';


export const UserTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [UserName, setUserName] = useState<string | null>(null);
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [total,settotal]=useState<number>(10);
  useEffect(() => {
    getAllUser();
  }, [pageIndex, pageSize, ordertype, UserName]);

  const getAllUser = async () => {
    try {
      const data:any  = await searchUser({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content: UserName,
      });
      settotal(data.data[0].TotalRecords);
      setListUser(data.data || []);
    } catch (err) {
      console.error('Failed to fetch User list:', err);
    }
  };

  const columns: TableColumnsType<IUser> = [
    {
      title: 'Số thứ tự',
      width: 50,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên tài khoản',
      width: 150,
      dataIndex: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: 'Thao tác',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <UserModal row={record} getAll={getAllUser} />
          <UserDelete UserId={record.id} getAllUser={getAllUser} />
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
          <UserModal isCreate getAll={getAllUser} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listUser}
        loading={false}
        scroll={{ x: 0 }}
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
