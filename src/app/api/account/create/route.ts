//3
import { verifyAuth } from '@/helpers/auth/auth.helper';
import { createAccountService } from '@/helpers/services/account.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request, 'ACCOUNT_MANAGE'); // Truyền vào mã phân quyền

    if (authResult.error) {
      return authResult.error;
    }

    const model = await request.json();
    const result = await createAccountService(model);
    return NextResponse.json({ success: true, data: result }, { status: 200 });

  } catch (error: any) {
    console.error("API Error in POST /api/account/create:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}