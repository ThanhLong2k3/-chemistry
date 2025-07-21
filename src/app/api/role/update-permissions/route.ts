// src/app/api/roles/update-permissions/route.ts
import { verifyAuth } from '@/helpers/auth/auth.helper';
import { updatePermissionsForRoleService } from '@/helpers/services/role.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Bảo vệ API này, chỉ người có quyền quản lý nhóm quyền mới được dùng
        const authResult = await verifyAuth(request, 'ROLE_MANAGE');
        if (authResult.error) {
            return authResult.error;
        }

        // Lấy dữ liệu từ body request
        const { role_id, permission_ids } = await request.json();

        // Service giờ trả về một boolean (true/false)
        const isSuccess = await updatePermissionsForRoleService(role_id, permission_ids);

        // Logic kiểm tra mới, đơn giản hơn
        if (isSuccess) {
            return NextResponse.json({ success: true, message: "Cập nhật quyền thành công." }, { status: 200 });
        } else {
            // Lỗi này giờ là lỗi thực sự từ CSDL đã được bắt bởi khối try-catch trong repository
            throw new Error("Cập nhật quyền thất bại tại CSDL.");
        }

    } catch (error: any) {
        console.error("API Error in POST /api/roles/update-permissions:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Lỗi máy chủ' },
            { status: 500 }
        );
    }
}