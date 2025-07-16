import { verifyAuth } from '@/helpers/auth/auth.helper';
import { deleteLessonService } from '@/helpers/services/lesson.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, ['admin', 'teacher']);
        if (authResult.error) {
            return authResult.error;
        }
        const { id, deleted_by } = await request.json();
        const result = await deleteLessonService(id, deleted_by);

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
