
import { NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';

export async function db_Provider<T>(
  query: string,
  params: any[] = [],
  isModification = false,
) {
  try {
    const data: any = await executeQuery<T[]>(query, params);

    if (isModification) {
      const resultData = data[0]?.[0];

      if (resultData && typeof resultData === 'object') {
        if (resultData.NewId !== undefined) {
          console.log("ID ADD_UPDATE_DELETE (NewId)", resultData.NewId);
          return { id: resultData.NewId }; // Trả về object chứa ID hoặc một giá trị nhận biết
        } else if (resultData.RESULT !== undefined) {
          console.log("ID ADD_UPDATE_DELETE (RESULT)", resultData.RESULT);
          return { result: resultData.RESULT }; // Trả về object chứa RESULT
        }
      }
      // Trả về một đối tượng mặc định nếu không tìm thấy NewId/RESULT hoặc cấu trúc khác
      return { success: true, details: data };
    } else {
      // Đối với các thao tác đọc (GET) vẫn trả về mảng dữ liệu
      return data?.[0] ?? [];
    }
  } catch (error) {
    console.error("Database Provider Error:", error);
    // Vẫn throw lỗi để các tầng trên bắt lấy và xử lý (ví dụ: trả về NextResponse.json lỗi)
    throw error; // Quan trọng: ném lỗi thay vì trả về NextResponse.json lỗi ở đây
  }
}