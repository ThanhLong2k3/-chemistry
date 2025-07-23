import { verifyAuth } from '@/helpers/auth/auth.helper';
import { deleteSubjectService } from '@/helpers/services/subject.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, 'SUBJECT_MANAGE'); // Truyền vào mã phân quyền

        if (authResult.error) {
            return authResult.error;
        }
        const { id, deleted_by } = await request.json();
        const result = await deleteSubjectService(id, deleted_by);

        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
