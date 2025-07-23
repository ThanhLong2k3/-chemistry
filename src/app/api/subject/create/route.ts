import { verifyAuth } from '@/helpers/auth/auth.helper';
import { createSubjectService } from '@/helpers/services/subject.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, 'SUBJECT_MANAGE'); // Truyền vào mã phân quyền

        if (authResult.error) {
            return authResult.error;
        }

        const model = await request.json();
        const result = await createSubjectService(model);
        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });
    } catch (error: any) {
        console.error("API Error in POST /api/subject/create:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}