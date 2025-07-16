import { verifyAuth } from '@/helpers/auth/auth.helper';
import { updateAccountService } from '@/helpers/services/account.service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    //xác thực token
    const authResult = await verifyAuth(request, ['admin']);
    if (authResult.error) {
      return authResult.error;
    }

    const model = await request.json();
    const result = await updateAccountService(model);

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
