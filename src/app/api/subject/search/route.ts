import { searchSubjectService } from '@/helpers/services/subject.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const model = await request.json();
        const data = await searchSubjectService(model);

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

