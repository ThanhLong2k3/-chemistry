'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { AdvisoryMemberTable } from "./components/AdvisoryMemberTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert } from "antd";


export const ManageAdvisoryMember = () => {
    const { hasPermission } = usePermissions();
    return (
        <>
            <Header_Children title={'Quản lý ban tư vấn'} />
            {
                !hasPermission('ADVISORY_MANAGE') ?
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
                            <AdvisoryMemberTable />
                        </div>
                    )
            }
        </>
    );
};
