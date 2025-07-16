// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/libs/access';

export async function GET(request: NextRequest) {
    try {
        // 1. Lấy token từ header 'Authorization'
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'Authorization header bị thiếu hoặc không hợp lệ' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // 2. Dùng hàm verifyToken để xác thực
        const payload = await verifyToken(token);

        // 3. Xử lý kết quả
        if (!payload) {
            return NextResponse.json(
                { message: 'Token không hợp lệ hoặc đã hết hạn' },
                { status: 401 }
            );
        }

        // Trả về thông tin người dùng nếu token hợp lệ
        return NextResponse.json({ account: payload }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Lỗi server nội bộ' },
            { status: 500 }
        );
    }
}