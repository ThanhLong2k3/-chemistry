import { verifyAuth } from '@/helpers/auth/auth.helper';
import { deleteAccountService } from '@/helpers/services/account.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    //xác thực token
    const authResult = await verifyAuth(request, 'ACCOUNT_MANAGE');
    if (authResult.error) {
      return authResult.error;
    }
    const { username, deleted_by } = await request.json();
    const result = await deleteAccountService(username, deleted_by);

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
