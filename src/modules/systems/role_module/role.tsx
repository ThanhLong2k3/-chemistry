'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { RoleTable } from "./components/RoleTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert, Row, Col } from "antd";
import { PermissionAssignment } from "./components/PermissionAssignment"; // <-- Import component mới
import { useEffect } from "react";

export const ManageRole = () => {
    const { hasPermission } = usePermissions();
    useEffect(() => {
        document.title = "Phân quyền hệ thống";
    }, []);

    return (
        <>
            <Header_Children title={'Quản lý nhóm quyền'} />
            {
                !hasPermission('ROLE_MANAGE') ?
                    (
                        <div>
                            <Alert
                                message="Không có quyền truy cập"
                                description="Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên."
                                type="error"
                                showIcon
                            />
                        </div>
                    ) :
                    (
                        <div >
                            <Row gutter={24}>
                                {/* CỘT TRÁI: PHÂN QUYỀN */}
                                <Col xs={24} md={8}>
                                    <PermissionAssignment />
                                </Col>

                                {/* CỘT PHẢI: QUẢN LÝ DANH SÁCH NHÓM QUYỀN */}
                                <Col xs={24} md={16}>
                                    <RoleTable />
                                </Col>
                            </Row>
                        </div>
                    )
            }
        </>
    );
};