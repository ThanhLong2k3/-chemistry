import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua check token cho login nếu cần
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Chuyển hướng root `/` → `/home_user/home`
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/web/home_user/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:path*'],
};
