'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { SubjectTable } from "./components/SubjectTable";


export const ManageSubject = () => {

    return (
        <>
            <Header_Children title={'Quản lý môn học'} />
            <div >
                <SubjectTable />
            </div>
        </>
    );
};
