'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { LessonTable } from "./components/LessonTable";


export const ManageLesson = () => {

    return (
        <>
            <Header_Children title={'Quản lý nội dung bài học/Quản lý bài học'} />
            <div >
                <LessonTable />
            </div>
        </>
    );
};
