import { createUserService } from '@/helpers/services/user.service';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const model = await request.json();
    const id = await createUserService(model);
    console.log(id);
    return NextResponse.json({
      success: true,
      message: 'Thêm mới thành công!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
