import { verifyAuth } from '@/helpers/auth/auth.helper';
import { getExamCreatedByNameService } from '@/helpers/services/exam.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request, 'EXAM_MANAGE');
        if (authResult.error) return authResult.error;

        const authors = await getExamCreatedByNameService();

        return NextResponse.json({
            success: true,
            data: authors
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}