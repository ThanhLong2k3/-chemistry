import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpService } from '@/helpers/services/account.service';

export async function POST(req: NextRequest) {
    try {
        const { otp, otpToken } = await req.json();
        const result = await verifyOtpService(otp, otpToken);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}