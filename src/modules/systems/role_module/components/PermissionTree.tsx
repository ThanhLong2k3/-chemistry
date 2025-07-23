'use client';

import { Tree, Alert, Empty, Spin } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import React from 'react';
import { searchDecentralizationFromClient } from '@/services/decentralization.service';
import { getPermissionsForRole } from '@/services/role.service';

// Interface để định nghĩa cấu trúc của một mục quyền
interface Permission {
    id: string;
    name: string;
    id_parent: string | null;
}

// Interface định nghĩa các props mà component này nhận vào
interface Props {
    roleId: string; // ID của vai trò đang được chọn để phân quyền
    onSelectionChange: (selectedIds: string[]) => void; // Hàm callback để báo lại cho cha
}

export const PermissionTree = ({ roleId, onSelectionChange }: Props) => {
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setCheckedKeys([]); // Reset các key đã check khi đổi vai trò

            try {
                const token = localStorage.getItem('TOKEN');
                if (!token) throw new Error("Yêu cầu không được xác thực.");
                const headers = { 'Authorization': `Bearer ${token}` };

                //lấy ra tất cả phân quyền để vẽ cây
                const allPermsResponse = await searchDecentralizationFromClient({
                    page_index: 1,
                    page_size: 1000
                });

                if (allPermsResponse.success) {
                    setAllPermissions(allPermsResponse.data);
                } else {
                    throw new Error(allPermsResponse.message || 'Lỗi khi tải danh sách quyền.');
                }

                //lấy ra các phân quyền mà nhóm quyền có quyền truy cập
                const rolePermsResponse = await getPermissionsForRole(roleId);

                if (rolePermsResponse.success) {
                    const initialCheckedKeys = rolePermsResponse.data || [];
                    setCheckedKeys(initialCheckedKeys);
                    onSelectionChange(initialCheckedKeys);
                } else {
                    throw new Error(rolePermsResponse.message || 'Lỗi khi tải quyền của vai trò.');
                }
            } catch (err: any) {
                setError(err.message || 'Không thể tải dữ liệu phân quyền.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roleId, onSelectionChange]);

    const treeData = useMemo(() => {
        if (!allPermissions || allPermissions.length === 0) return [];

        const map = new Map<string, any>();
        const roots: any[] = [];

        allPermissions.forEach(p => {
            map.set(p.id, { key: p.id, title: p.name, children: [] });
        });

        allPermissions.forEach(p => {
            if (p.id_parent && map.has(p.id_parent)) {
                map.get(p.id_parent).children.push(map.get(p.id));
            } else {
                roots.push(map.get(p.id));
            }
        });
        return roots;
    }, [allPermissions]);

    // Hàm được gọi khi người dùng tick hoặc bỏ tick một checkbox (Giữ nguyên)
    const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
        const keys = Array.isArray(checked) ? checked : checked.checked;
        setCheckedKeys(keys);
        onSelectionChange(keys as string[]);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Spin />
            </div>
        );
    }

    if (error) return <Alert message={error} type="error" showIcon />;
    if (treeData.length === 0) return <Empty description="Không có dữ liệu phân quyền" />;

    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
            <Tree
                checkable
                defaultExpandAll
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={treeData}
            />
        </div>
    );
};