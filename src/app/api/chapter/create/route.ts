import { verifyAuth } from '@/helpers/auth/auth.helper';
import { createChapterService } from '@/helpers/services/chapter.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, ['admin', 'teacher']);
        if (authResult.error) {
            return authResult.error;
        }
        const model = await request.json();
        const result = await createChapterService(model);
        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });
    } catch (error: any) {
        console.error("API Error in POST /api/chapter/create:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}