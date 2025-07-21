import { verifyAuth } from '@/helpers/auth/auth.helper';
import { updateLessonService } from '@/helpers/services/lesson.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, 'LESSON_MANAGE'); // Truyền vào mã phân quyền

        if (authResult.error) {
            return authResult.error;
        }

        const model = await request.json();
        const result = await updateLessonService(model);

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
