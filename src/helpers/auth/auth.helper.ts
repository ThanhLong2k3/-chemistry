import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '@/types/decodedToken';
import { jwtDecode } from 'jwt-decode';

const JWT_SECRET = process.env.JWT_SECRET;

// Interface này định nghĩa cấu trúc payload trong token của bạn
interface AuthPayload {
    username: string;
    role: 'admin' | 'teacher' | 'collaborator' | 'student';
    email: string;
    image: string;
    name: string;

}

/**
 * Xác thực token từ request và kiểm tra quyền truy cập.
 * @param request - Đối tượng NextRequest.
 *- @param requiredRoles - (Tùy chọn) Một mảng các quyền được phép truy cập.
 * @returns Trả về một object chứa { error: NextResponse } nếu xác thực thất bại, 
 *          hoặc { payload: AuthPayload } nếu thành công.
 */
export async function verifyAuth(request: NextRequest, requiredRoles?: Array<'admin' | 'teacher' | 'collaborator' | 'student'>) {
    // Kiểm tra xem JWT_SECRET đã được thiết lập chưa
    if (!JWT_SECRET) {
        console.error('Lỗi cấu hình: JWT_SECRET chưa được thiết lập.');
        return {
            error: NextResponse.json(
                { success: false, message: 'Lỗi cấu hình máy chủ.' },
                { status: 500 }
            )
        };
    }

    // 1. Lấy token từ header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            error: NextResponse.json(
                { success: false, message: 'Yêu cầu không được xác thực. Vui lòng đăng nhập.' },
                { status: 401 } // Unauthorized
            )
        };
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Xác thực token
        const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;

        // 3. (Quan trọng) Kiểm tra quyền nếu được yêu cầu
        if (requiredRoles && requiredRoles.length > 0) {
            if (!requiredRoles.includes(payload.role)) { // Kiểm tra xem role của user có nằm trong danh sách được phép không
                return {
                    error: NextResponse.json(
                        { success: false, message: 'Bạn không có quyền thực hiện hành động này.' },
                        { status: 403 } // Forbidden
                    )
                };
            }
        }

        // Nếu mọi thứ ổn, trả về payload đã được giải mã
        return { payload };

    } catch (error) {
        // Lỗi thường gặp nhất ở đây là TokenExpiredError (token hết hạn)
        return {
            error: NextResponse.json(
                { success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' },
                { status: 401 } // Unauthorized
            )
        };
    }
}

//lấy ra thông tin của tài khoản đang đăng nhập
export const getAccountLogin = () => {
    try {
        const token = localStorage.getItem('TOKEN');

        if (!token) {
            return null;
        }
        const accountInfo = jwtDecode<IDecodedToken>(token);
        return accountInfo;

    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        // Xóa token hỏng khỏi localStorage để tránh lỗi lặp lại
        localStorage.removeItem('TOKEN');
        return null;
    }
}