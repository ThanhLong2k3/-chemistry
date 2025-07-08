import { deleteUserService } from '@/helpers/services/user.service';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { menuId } = await request.json();
    const result= await deleteUserService(menuId);

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
