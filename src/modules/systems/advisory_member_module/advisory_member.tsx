'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { AdvisoryMemberTable } from "./components/AdvisoryMemberTable";


export const ManageAdvisoryMember = () => {

    return (
        <>
            <Header_Children title={'Quản lý ban tư vấn'} />
            <div >
                <AdvisoryMemberTable />
            </div>
        </>
    );
};
