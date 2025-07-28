import { registerAccountService } from '@/helpers/services/account.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const DEFAULT_STUDENT_ROLE_ID = 'ade9dcaa-ee35-42a4-8855-3ba1506fa65a'; // ID QUYỀN HỌC SINH
        const model = await request.json();
        const result = await registerAccountService({ ...model, role_id: DEFAULT_STUDENT_ROLE_ID });
        return NextResponse.json({ success: true, data: result }, { status: 200 });

    } catch (error: any) {
        console.error("API Error in POST /api/auth/register:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}