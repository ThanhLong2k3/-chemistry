'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { ChapterTable } from "./components/ChapterTable";


export const ManageChapter = () => {

    return (
        <>
            <Header_Children title={'Quản lý nội dung bài học/Quản lý chương'} />
            <div >
                <ChapterTable />
            </div>
        </>
    );
};
