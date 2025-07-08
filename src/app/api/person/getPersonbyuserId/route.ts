import { getPersonByIdService } from '@/helpers/services/person.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const id = await request.json();
    const data = await getPersonByIdService(id);

    console.log("data", data);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

