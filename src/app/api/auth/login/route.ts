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

        const account = await login(username, password);
        if (!account) {
            return NextResponse.json({ errorCode: 7, success: false }, { status: 401 }); // Đăng nhập thất bại
        }

        const token = jwt.sign(
            {
                username: account.username,
                role: account.role,
                email: account.email,
                name: account.name,
                image: account.image,
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
