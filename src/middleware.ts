import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { TOKEN_KEY } from './constants/config';
import { verifyToken } from './libs/access';
import { ADMIN_LOGIN_PATH } from './path';

// Tạo middleware xử lý locale
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
});

export async function middleware(request: NextRequest) {
  // Áp dụng locale middleware trước
  const response = intlMiddleware(request);

  const { pathname } = request.nextUrl;

  // Bỏ qua check token cho trang public như login
  if (pathname === '/vi/login' || pathname === '/en/login') {
    return response;
  }

  // Nếu là root `/vi` → chuyển hướng tới `/vi/home_user`
  if (pathname === '/vi') {
    return NextResponse.rewrite(new URL('/vi/home_user/home', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*'],
};
