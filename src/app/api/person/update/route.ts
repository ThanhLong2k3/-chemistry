import { updateUserService } from '@/helpers/services/user.service';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const model = await request.json();
    await updateUserService(model);

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thành công!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
