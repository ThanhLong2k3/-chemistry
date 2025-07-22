import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { login } from '@/services/account.service';
import { login } from '@/helpers/services/account.service';
import { executeQuery } from '@/libs/db';


const JWT_SECRET = process.env.JWT_SECRET || 'dinhthientruong21dinhthientruong09dinhthientruong2004!@#$%^&*()-_=+[{]}\|;:,<.>/?';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return NextResponse.json({ errorCode: 5, success: false }, { status: 400 });
        }

        //kết quả là một object chứ lỗi HOẶC chứa thông tin tài khoản chính xác
        const loginResult = await login(username, password);

        if (loginResult.error) {
            //trả về status 401 với thông báo lỗi cụ thể
            return NextResponse.json({ success: false, message: loginResult.error }, { status: 401 });
        }
        const account = loginResult;

        const token = jwt.sign(
            {
                username: account.username,
                role_id: account.role_id,
                email: account.email,
                name: account.name,
                image: account.image,
                permissions: account.permissions
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            token
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ errorCode: 8 }, { status: 500 });
    }
}
