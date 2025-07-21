'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { LessonTable } from "./components/LessonTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert } from "antd";


export const ManageLesson = () => {
    const { hasPermission } = usePermissions();

    return (
        <>
            <Header_Children title={'Quản lý nội dung bài học/Quản lý bài học'} />
            {
                !hasPermission('LESSON_MANAGE') ? (
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
                            <LessonTable />
                        </div>
                    )
            }
        </>
    );
};
