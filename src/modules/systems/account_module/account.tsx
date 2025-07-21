'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { AccountTable } from "./components/AccountTable";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert } from "antd";

export const ManageAccount = () => {
  const { hasPermission } = usePermissions();

  return (
    <>
      <Header_Children title={'Quản lý tài khoản'} />
      {
        !hasPermission('ACCOUNT_MANAGE') ?
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
              <AccountTable />
            </div>
          )
      }
    </>
  );
};