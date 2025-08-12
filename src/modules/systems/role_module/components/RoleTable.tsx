import { Card, Flex, type TableColumnsType, Table, Input, Tag } from 'antd';

import { useEffect, useState } from 'react';
import { searchRole } from '@/services/role.service';
import { IRole } from '@/types/role';
import { RoleModal } from './RoleModal';
import { RoleDelete } from './RoleDelete';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/env/getInfor_token';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import env from '@/env';

export const RoleTable = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [ordertype, setOrderType] = useState<string>('ASC');
  const [nameRole, setNameRole] = useState<string | null>(null);
  const [listRole, setListRole] = useState<IRole[]>([]);
  const [total, settotal] = useState<number>(10);
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(
    null
  );

  //reset lại pageindex khi có dữ liệu tìm kiếm
  useEffect(() => {
    setPageIndex(1);
  }, [nameRole]);

  useEffect(() => {
    getAllRole();
  }, [pageIndex, pageSize, ordertype, nameRole]);

  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const getAllRole = async () => {
    try {
      const data: any = await searchRole({
        page_index: pageIndex,
        page_size: pageSize,
        order_type: ordertype,
        search_content_1: nameRole,
      });
      settotal(data.data[0]?.TotalRecords);
      setListRole(data.data || []);
    } catch (error) {
      let errorMessage = 'Đã có lỗi không xác định xảy ra.';

      if (axios.isAxiosError(error)) {
        const axiosError = error; // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
  };

  const columns: TableColumnsType<IRole> = [
    {
      title: 'STT',
      width: 40,
      align: 'center',
      render: (_, __, index) =>
        (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
    },
    {
      title: 'Tên nhóm quyền',
      width: 200,
      dataIndex: 'name',
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
      render: (_, record) => {
        // Nếu id là mã đặc biệt thì không hiển thị nút sửa/xóa
        if (record.id === `${env.ID_ROLE_STUDENT }`) {
          return null;
        }

        return (
          <Flex gap={8} justify="center">
            <RoleModal row={record} getAll={getAllRole} />
            {currentAccount && (
              <RoleDelete
                id={record.id}
                deleted_by={currentAccount?.username}
                getAllRole={getAllRole}
              />
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <Card>
      <Flex justify="flex-end" gap={8} style={{ marginBottom: 16 }}>
        <Input
          placeholder=" Nhập tên nhóm quyền để tìm kiếm..."
          value={nameRole ?? ''}
          onChange={(e) => setNameRole(e.target.value.replace(/^\s+/, ''))}
          allowClear
        />
        <RoleModal isCreate={true} getAll={getAllRole} />
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={listRole}
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
