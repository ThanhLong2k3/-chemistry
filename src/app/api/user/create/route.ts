// C:\Users\Phuong Linh\Desktop\GiaPha\src\app\api\user\create\route.ts

import { createUserService } from '@/helpers/services/user.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const model = await request.json();
    const result = await createUserService(model); 
    return NextResponse.json({
      success: true, 
      data: result 
    }, { status: 200 }); 
  } catch (error: any) {
    console.error("API Error in POST /api/user/create:", error); 
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}