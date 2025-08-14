'use client';

import { Card, Select, Button, Space, Alert, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { IRole } from '@/types/role';
import {
  searchRole,
  updatePermissionsForRoleOnClient,
} from '@/services/role.service';
import { PermissionTree } from './PermissionTree';
import { useNotification } from '@/components/UI_shared/Notification';
import { SaveOutlined } from '@ant-design/icons';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';

export const PermissionAssignment = ({
  allRoles,
  isLoadingRoles,
  selectedRoleId,
  setSelectedRoleId,
}: {
  allRoles: IRole[];
  isLoadingRoles: boolean;
  selectedRoleId: string | undefined;
  setSelectedRoleId: any;
}) => {
  const { show } = useNotification();

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  // Hàm xử lý khi nhấn nút "Lưu"
  const handleSaveChanges = async () => {
    if (!selectedRoleId) {
      show({
        result: 1,
        messageError: 'Vui lòng chọn một nhóm quyền để cập nhật.',
      });
      return;
    }
    setIsSaving(true);
    try {
      const response = await updatePermissionsForRoleOnClient(
        selectedRoleId,
        selectedPermissionIds
      );

      if (response.success) {
        show({ result: 0, messageDone: 'Cập nhật phân quyền thành công!' });
        //lấy thông tin người dùng đang đăng nhập
        const currentAccount = getAccountLogin();
        if (!currentAccount) {
          console.log('CHƯA LẤY ĐƯỢC QUYỀN CỦA TÀI KHOẢN ĐANG ĐĂNG NHẬP');
          return;
        }
        //nếu phân quyền của tài khoản đang đăng nhập vừa được cập nhật thì cho đăng nhập lại
        if (currentAccount.role_id === selectedRoleId) {
          setTimeout(() => {
            showSessionExpiredModal();
          }, 2000);
        }
      } else {
        throw new Error(response.message || 'Lỗi khi cập nhật phân quyền.');
      }
    } catch (error: any) {
      show({ result: 1, messageError: error.message || 'Đã có lỗi xảy ra.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title="Phân quyền">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn hoặc tìm kiếm nhóm quyền"
          value={selectedRoleId}
          onChange={(value) => setSelectedRoleId(value)}
          loading={isLoadingRoles}
          // Logic để Antd Select có thể lọc danh sách đã tải về
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          // Chuyển đổi mảng roles thành định dạng options
          options={allRoles.map((role) => ({
            value: role.id,
            label: role.name,
          }))}
        />

        {/* Phần hiển thị cây checkbox */}
        {isLoadingRoles ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <Spin />
          </div>
        ) : selectedRoleId ? (
          <PermissionTree
            key={selectedRoleId}
            roleId={selectedRoleId}
            onSelectionChange={setSelectedPermissionIds}
          />
        ) : (
          <Alert
            message="Vui lòng chọn một nhóm quyền để xem và gán quyền."
            type="info"
            showIcon
          />
        )}

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSaving}
          onClick={handleSaveChanges}
          disabled={!selectedRoleId}
          style={{ width: '100%' }}
        >
          Lưu
        </Button>
      </Space>
    </Card>
  );
};
