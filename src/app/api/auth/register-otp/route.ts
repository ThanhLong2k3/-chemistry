import { NextRequest, NextResponse } from 'next/server';
import { registerOTPService } from '@/helpers/services/account.service';

export async function POST(req: NextRequest) {
    try {
        const { email, username } = await req.json();
        const result = await registerOTPService(email, username);

        // Trả về kết quả mà service đã xử lý
        return NextResponse.json(result, { status: 200 });

    } catch (err: any) {
        console.error('Lỗi API otp đăng ký tài khoản:', err);
        return NextResponse.json({ success: false, message: err.message || 'Gửi email thất bại do lỗi hệ thống.' }, { status: 500 });
    }
}