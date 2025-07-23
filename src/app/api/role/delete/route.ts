import { verifyAuth } from '@/helpers/auth/auth.helper';
import { deleteRoleService } from '@/helpers/services/role.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        //xác thực token
        const authResult = await verifyAuth(request, 'ROLE_MANAGE');
        if (authResult.error) {
            return authResult.error;
        }
        const { id } = await request.json();
        const result = await deleteRoleService(id);

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
