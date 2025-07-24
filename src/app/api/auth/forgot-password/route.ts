import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordService } from '@/helpers/services/account.service';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const result = await forgotPasswordService(email);

        // Trả về kết quả mà service đã xử lý
        return NextResponse.json(result, { status: 200 });

    } catch (err: any) {
        console.error('Lỗi API quên mật khẩu:', err);
        return NextResponse.json({ success: false, message: err.message || 'Gửi email thất bại do lỗi hệ thống.' }, { status: 500 });
    }
}