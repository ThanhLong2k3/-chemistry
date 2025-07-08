'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { UserTable } from "./components/UserTable";


export const ManageUser = () => {

  return (
    <>
      <Header_Children title={'Quản lý tài khoản'}/>
      <div >
        <UserTable />
      </div>
    </>
  );
};
