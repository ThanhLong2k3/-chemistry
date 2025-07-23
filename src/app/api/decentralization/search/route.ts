import { verifyAuth } from '@/helpers/auth/auth.helper';
import { searchDecentralizationService } from '@/helpers/services/decentralization.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request, 'ROLE_MANAGE');
        if (authResult.error) return authResult.error;

        const data = await searchDecentralizationService();

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

