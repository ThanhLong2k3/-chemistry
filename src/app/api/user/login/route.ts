import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/constants/config';
import { generateToken, generateRefreshToken } from '@/libs/access';
import { authenticateService } from '@/helpers/services/user.service';

export async function POST(request: Request) {
  try {
    const { UserName, PassWork } = await request.json();

    const res = await authenticateService(UserName, PassWork);
    if (!res) {
      return NextResponse.json(
        { message: 'Tài khoản hoặc mật khẩu không đúng.', success: false },
        { status: 500 }
      );
    }

    const { ...user } = res;
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);


    cookies().set(TOKEN_KEY, token, {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.smartchat.com.vn' : '',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      // maxAge: 30,
      sameSite: 'lax', // Good default for security
    });

    cookies().set(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.smartchat.com.vn' : '',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax', // Good default for security
    });

    return NextResponse.json({
      message: 'Đăng nhập thành công.',
      success: true,
      username:user[0].username,
      role:user[0].role,
      id_user:user[0].id
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, success: false },
      { status: 500 }
    );
  }
}
