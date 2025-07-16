import { searchLessonService } from '@/helpers/services/lesson.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const model = await request.json();
        const data = await searchLessonService(model);

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

