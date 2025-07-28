import {  getlessonDetailById } from "@/helpers/services/home.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID trong query." },
        { status: 400 }
      );
    }

    const data = await getlessonDetailById(id);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Đã xảy ra lỗi.",
      },
      { status: 500 }
    );
  }
}
