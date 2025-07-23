import { GetSubjectDetailById } from "@/helpers/services/home.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const model = await request.json();
        const id = model.id; 
        const data = await GetSubjectDetailById(id);

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