'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { ExamTable } from "./components/ExamTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert } from "antd";
import { useEffect } from "react";


export const ManageExam = () => {
    const { hasPermission } = usePermissions();
    useEffect(() => {
        document.title = "Quản lý đề kiểm tra";
    }, []);

    return (
        <>
            <Header_Children title={'Quản lý nội dung bài học/Quản lý đề kiểm tra'} />
            {
                !hasPermission('EXAM_MANAGE') ? (
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
                            <ExamTable />
                        </div>
                    )
            }
        </>
    );
};
