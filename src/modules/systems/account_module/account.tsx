'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { AccountTable } from "./components/AccountTable";



export const ManageAccount = () => {

  return (
    <>
      <Header_Children title={'Quản lý tài khoản'} />
      <div >
        <AccountTable />
      </div>
    </>
  );
};
