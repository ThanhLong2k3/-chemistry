import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordService } from '@/helpers/services/account.service';

export async function POST(req: NextRequest) {
    try {
        const { email, newPassword } = await req.json();
        const result = await resetPasswordService(email, newPassword);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}