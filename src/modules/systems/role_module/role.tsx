'use client';

import Header_Children from '@/components/UI_shared/Children_Head';
import { RoleTable } from './components/RoleTable';
import { usePermissions } from '@/contexts/PermissionContext';
import { Alert, Row, Col } from 'antd';
import { PermissionAssignment } from './components/PermissionAssignment'; // <-- Import component mới
import { useEffect, useState } from 'react';
import { IRole } from '@/types/role';
import { searchRole } from '@/services/role.service';
import { useNotification } from '@/components/UI_shared/Notification';

export const ManageRole = () => {
  const { hasPermission } = usePermissions();
  const [allRoles, setAllRoles] = useState<IRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(
    undefined
  );
  const { show } = useNotification();

  useEffect(() => {
    document.title = 'Phân quyền hệ thống';
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await searchRole({
        page_index: 1,
        page_size: 1000, // Lấy tất cả trong một lần gọi
      });

      if (response.success) {
        const activeRoles = response.data || [];
        setAllRoles(activeRoles);
        if (activeRoles.length > 0) {
          setSelectedRoleId(activeRoles[0].id);
        }
      } else {
        show({
          result: 1,
          messageError:
            response.message || 'Không thể tải danh sách nhóm quyền.',
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách vai trò:', error);
      // Bạn có thể thêm hàm handleApiError ở đây nếu muốn
      show({
        result: 1,
        messageError: 'Lỗi kết nối khi tải danh sách nhóm quyền.',
      });
    } finally {
      setIsLoadingRoles(false);
    }
  };
  return (
    <>
      <Header_Children title={'Quản lý nhóm quyền'} />
      {!hasPermission('ROLE_MANAGE') ? (
        <div>
          <Alert
            message="Không có quyền truy cập"
            description="Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên."
            type="error"
            showIcon
          />
        </div>
      ) : (
        <div>
          <Row gutter={24}>
            {/* CỘT TRÁI: PHÂN QUYỀN */}
            <Col xs={24} md={10}>
              <PermissionAssignment
                allRoles={allRoles}
                isLoadingRoles={isLoadingRoles}
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={setSelectedRoleId}
              />
            </Col>

            {/* CỘT PHẢI: QUẢN LÝ DANH SÁCH NHÓM QUYỀN */}
            <Col xs={24} md={14}>
              <RoleTable get_All_Role={fetchAllRoles} />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
