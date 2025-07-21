'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { SubjectTable } from "./components/SubjectTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert } from "antd";


export const ManageSubject = () => {
    const { hasPermission } = usePermissions();

    if (!hasPermission('SUBJECT_MANAGE')) {
        return (
            <Alert
                message="Không có quyền truy cập"
                description="Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên."
                type="error"
                showIcon
            />
        );
    }
    return (
        <>
            <Header_Children title={'Quản lý môn học'} />
            <div >
                <SubjectTable />
            </div>
        </>
    );
};
