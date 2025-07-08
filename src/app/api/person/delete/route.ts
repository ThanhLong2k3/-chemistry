import { deleteUserService } from '@/helpers/services/user.service';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { menuId } = await request.json();
    await deleteUserService(menuId);

    return NextResponse.json({ success: true, message: 'Xóa thành công!' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
