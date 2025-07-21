import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '@/types/decodedToken';
import { jwtDecode } from 'jwt-decode';
import { checkPermission } from '../repositories/permission.repository';

const JWT_SECRET = process.env.JWT_SECRET;

// Interface này định nghĩa cấu trúc payload trong token của bạn
interface AuthPayload {
    username: string;
    role_id: string;
    email: string;
    image: string;
    name: string;

}

/**
 * Xác thực token từ request và kiểm tra quyền truy cập động trong CSDL.
 * @param request - Đối tượng NextRequest.
 * @param requiredPermissionCode - (Bắt buộc) Mã phân quyền duy nhất cần có để truy cập API này.
 * @returns Trả về một object chứa { error: NextResponse } nếu xác thực thất bại, 
 *          hoặc { user: AuthPayload } nếu thành công. (Đổi tên 'payload' thành 'user' cho rõ nghĩa)
 */
export async function verifyAuth(request: NextRequest, requiredPermissionCode?: string) {
    if (!JWT_SECRET) {
        console.error('Lỗi cấu hình: JWT_SECRET chưa được thiết lập.');
        return {
            error: NextResponse.json(
                { success: false, message: 'Lỗi cấu hình máy chủ.' },
                { status: 500 }
            )
        };
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            error: NextResponse.json(
                { success: false, message: 'Yêu cầu không được xác thực. Vui lòng đăng nhập.' },
                { status: 401 }
            )
        };
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Xác thực token, không thay đổi
        const user = jwt.verify(token, JWT_SECRET) as AuthPayload;

        // 2. (QUAN TRỌNG) Kiểm tra quyền động nếu được yêu cầu
        if (requiredPermissionCode) {
            // Gọi hàm checkPermission từ CSDL
            const hasPermission = await checkPermission(user.role_id, requiredPermissionCode);

            if (!hasPermission) {
                return {
                    error: NextResponse.json(
                        { success: false, message: 'Bạn không có quyền thực hiện hành động này.' },
                        { status: 403 } // Forbidden
                    )
                };
            }
        }

        // Nếu mọi thứ ổn, trả về thông tin người dùng
        return { user };

    } catch (error) {
        return {
            error: NextResponse.json(
                { success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' },
                { status: 401 }
            )
        };
    }
}

