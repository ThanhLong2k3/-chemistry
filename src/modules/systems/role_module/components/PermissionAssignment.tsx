'use client';

import { Card, Select, Button, Space, Alert, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { IRole } from '@/types/role';
import { searchRole, updatePermissionsForRoleOnClient } from '@/services/role.service';
import { PermissionTree } from './PermissionTree';
import { useNotification } from '@/components/UI_shared/Notification';
import { SaveOutlined } from '@ant-design/icons';
import { showSessionExpiredModal } from '@/utils/session-handler';

export const PermissionAssignment = () => {
    const { show } = useNotification();

    const [allRoles, setAllRoles] = useState<IRole[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(undefined);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
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
                    show({ result: 1, messageError: response.message || 'Không thể tải danh sách nhóm quyền.' });
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách vai trò:", error);
                // Bạn có thể thêm hàm handleApiError ở đây nếu muốn
                show({ result: 1, messageError: 'Lỗi kết nối khi tải danh sách nhóm quyền.' });
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchAllRoles();
    }, []); // Mảng rỗng đảm bảo chỉ chạy một lần

    // Hàm xử lý khi nhấn nút "Lưu"
    const handleSaveChanges = async () => {
        if (!selectedRoleId) {
            show({ result: 1, messageError: "Vui lòng chọn một nhóm quyền để cập nhật." });
            return;
        }
        setIsSaving(true);
        try {
            const response = await updatePermissionsForRoleOnClient(
                selectedRoleId,
                selectedPermissionIds
            );

            if (response.success) {
                show({ result: 0, messageDone: "Cập nhật phân quyền thành công!" });
                // Đợi 2 giây rồi mới hiển thị modal
                setTimeout(() => {
                    showSessionExpiredModal();
                }, 2000);
            } else {
                throw new Error(response.message || "Lỗi khi cập nhật phân quyền.");
            }
        } catch (error: any) {
            // Có thể dùng hàm handleApiError ở đây
            show({ result: 1, messageError: error.message || "Đã có lỗi xảy ra." });
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
                    options={allRoles.map(role => ({
                        value: role.id,
                        label: role.name,
                    }))}
                />

                {/* Phần hiển thị cây checkbox */}
                {isLoadingRoles ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : selectedRoleId ? (
                    <PermissionTree
                        key={selectedRoleId}
                        roleId={selectedRoleId}
                        onSelectionChange={setSelectedPermissionIds}
                    />
                ) : (
                    <Alert message="Vui lòng chọn một nhóm quyền để xem và gán quyền." type="info" showIcon />
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