import { GetSubjectsWithLessonsService } from "@/helpers/services/home.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await GetSubjectsWithLessonsService();

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