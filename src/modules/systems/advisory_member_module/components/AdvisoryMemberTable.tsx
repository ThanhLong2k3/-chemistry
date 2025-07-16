import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchAdvisoryMember } from '@/services/advisory_member.service';
import { IAdvisoryMember } from '@/types/advisory_member';
import { AdvisoryMemberModal } from './AdvisoryMemberModal';
import { AdvisoryMemberDelete } from './AdvisoryMemberDelete';
import { getAccountLogin } from '@/helpers/auth/auth.helper';
import { IDecodedToken } from '@/types/decodedToken';

export const AdvisoryMemberTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameAdvisoryMember, setNameAdvisoryMember] = useState<string | null>(null);
  const [listAdvisoryMember, setListAdvisoryMember] = useState<IAdvisoryMember[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  useEffect(() => {
    getAllAdvisoryMember();
  }, [pageIndex, pageSize, ordertype, nameAdvisoryMember]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllAdvisoryMember = async () => {
    try {
      const data: any = await searchAdvisoryMember({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content: nameAdvisoryMember,
      });
      settotal(data.data[0]?.TotalRecords);
      setListAdvisoryMember(data.data || []);
    } catch (err) {
      console.error('Failed to fetch AdvisoryMember list:', err);
    }
  };

  const columns: TableColumnsType<IAdvisoryMember> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên giáo viên',
      width: 110,
      dataIndex: 'teacher_name',
    },
    {
      title: 'Ảnh đại diện',
      width: 70,
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
      title: 'Trình độ',
      width: 70,
      dataIndex: 'qualification',
    },
    // {
    //   title: 'Bộ môn',
    //   width: 100,
    //   dataIndex: 'subject_name',
    // },
    // {
    //   title: 'Phụ trách',
    //   width: 100,
    //   dataIndex: 'in_charge',
    // },
    {
      title: 'Nơi công tác',
      width: 130,
      dataIndex: 'workplace',
    },
    {
      title: 'Số năm kinh nghiệm',
      width: 90,
      dataIndex: 'years_of_experience',
    },
    {
      title: 'Thao tác',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <AdvisoryMemberModal row={record} getAll={getAllAdvisoryMember} />
          {currentAccount ? (<AdvisoryMemberDelete id={record.id} deleted_by={currentAccount?.username} getAllAdvisoryMember={getAllAdvisoryMember} />) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Card >
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm bài học..."
          value={nameAdvisoryMember ?? ''}
          onChange={(e) => setNameAdvisoryMember(e.target.value)}
          allowClear
        />
        <AdvisoryMemberModal isCreate getAll={getAllAdvisoryMember} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listAdvisoryMember}
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
