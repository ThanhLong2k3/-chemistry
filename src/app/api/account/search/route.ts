import { searchAccountService } from '@/helpers/services/account.service';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/helpers/auth/auth.helper';

export async function POST(request: NextRequest) {
  try {
 

    const model = await request.json();
    const data = await searchAccountService(model);

    return NextResponse.json({
      success: true,
      message: 'Tìm kiếm tài khoản thành công.',
      data,
    });
  } catch (error: any) {
    console.error('[API_SEARCH_ACCOUNT_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra trong quá trình tìm kiếm.',
      },
      { status: 500 }
    );
  }
}