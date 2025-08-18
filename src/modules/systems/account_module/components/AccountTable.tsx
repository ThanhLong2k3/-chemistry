'use client';

import { Card, Flex, type TableColumnsType, Table, Input, Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

import { searchAccount } from '@/services/account.service';
import { IAccount } from '@/types/account';
import { AccountModal } from './AccountModal';
import { AccountDelete } from './AccountDelete';

import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';
import env from '@/env';
import { searchRole } from '@/services/role.service';
import { IRole } from '@/types/role';
import { IDecodedToken } from '@/types/decodedToken';
import { useSearchParams } from 'next/navigation';


export const AccountTable = () => {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get('role');

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [orderType, setOrderType] = useState<string>('ASC');
  const [name, setName] = useState<string | null>(null);
  const [listAccount, setListAccount] = useState<IAccount[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  // State mới cho việc lọc theo vai trò
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(roleFromUrl);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [status, setStatus] = useState<string | null>(null);

  // Lấy danh sách Vai trò (chỉ một lần)
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await searchRole({ page_index: 1, page_size: 1000 });
        if (res.success) setRoles(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách vai trò:', err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // Reset lại pageIndex khi có dữ liệu tìm kiếm hoặc lọc
  useEffect(() => {
    setPageIndex(1);
  }, [name, selectedRole, status]);

  const getAllAccount = async () => {
    setLoading(true);
    try {
      const data: any = await searchAccount({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: orderType,
        search_content_1: name,
        search_content_2: selectedRole,
        search_content_3: status
      });
      setTotal(data.data.length > 0 ? data.data[0].TotalRecords : 0);
      setListAccount(data.data || []);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showSessionExpiredModal();
      } else {
        console.error('Failed to fetch Account list:', error);
        setListAccount([]); // Xóa dữ liệu cũ khi có lỗi
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };
  // useEffect chính để tải lại dữ liệu bảng
  useEffect(() => {
    getAllAccount();
  }, [pageIndex, pageSize, orderType, name, selectedRole, status]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const columns: TableColumnsType<IAccount> = [
    {
      title: 'STT',
      width: 60,
      align: 'center',
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
    },
    {
      title: 'Ảnh đại diện',
      width: 110,
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
            onError={(e) => { e.currentTarget.src = '/image/default_user.jpg'; }}
          />
        );
      },
    },
    {
      title: 'Tên tài khoản',
      width: 120,
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: 'Tên người dùng',
      width: 200,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Quyền',
      width: 120,
      dataIndex: 'role_name',
    },
    {
      title: 'Trạng thái',
      width: 120,
      dataIndex: 'deleted',
      align: 'center',
      render: (deleted: number) =>
        deleted === 0 ? (
          <Tag color="green">Đã kích hoạt</Tag>
        ) : (
          <Tag color="red">Chưa kích hoạt</Tag>
        ),
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <AccountModal row={record} getAll={getAllAccount} />
          {currentAccount && <AccountDelete username={record.username} deleted_by={currentAccount.username} getAllAccount={getAllAccount} deleted={record.deleted} />}
        </Flex>
      ),
    },
  ];

  return (
    <Card>
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo quyền"
          style={{ width: 240 }}
          onChange={(value) => setSelectedRole(value || null)}
          allowClear
          showSearch
          optionFilterProp="children"
          loading={loadingRoles}
          value={selectedRole}
        >
          {roles.map(role => (
            <Select.Option key={role.id} value={role.name}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 300 }}
          onChange={(value) => setStatus(value ?? null)}
          allowClear
          value={status}
        >
          <Select.Option value={"0"}>Đã kích hoạt</Select.Option>
          <Select.Option value={"1"}>Chưa kích hoạt</Select.Option>
        </Select>

        <Input
          placeholder="Tìm kiếm theo tên người dùng..."
          value={name ?? ''}
          onChange={(e) => setName(e.target.value)}
          allowClear
        />
        <AccountModal isCreate getAll={getAllAccount} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listAccount}
        loading={loading}
        scroll={{ x: 'max-content', y: 380 }}
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