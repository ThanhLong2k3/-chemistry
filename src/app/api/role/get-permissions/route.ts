// src/app/api/roles/get-permissions/route.ts

import { verifyAuth } from '@/helpers/auth/auth.helper';
import { getRolePermissionsService } from '@/helpers/services/role.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Bảo vệ API
        const authResult = await verifyAuth(request, 'ROLE_MANAGE');
        if (authResult.error) {
            return authResult.error;
        }
        const { role_id } = await request.json();
        if (!role_id) {
            return NextResponse.json({ success: false, message: "Thiếu ID của vai trò." }, { status: 400 });
        }

        // Gọi service để lấy danh sách các ID quyền
        const permissionIds = await getRolePermissionsService(role_id);

        return NextResponse.json({
            success: true,
            data: permissionIds
        }, { status: 200 });

    } catch (error: any) {
        console.error(`Lỗi API POST /api/roles/get-permissions:`, error);
        return NextResponse.json(
            { success: false, message: error.message || 'Lỗi máy chủ' },
            { status: 500 }
        );
    }
}