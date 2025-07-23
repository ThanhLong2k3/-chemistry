import { verifyAuth } from '@/helpers/auth/auth.helper';
import { createRoleService } from '@/helpers/services/role.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, 'ROLE_MANAGE');
        if (authResult.error) {
            return authResult.error;
        }
        const model = await request.json();
        const result = await createRoleService(model);
        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });
    } catch (error: any) {
        console.error("API Error in POST /api/role/create:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}