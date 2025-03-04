import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token ?? '', process.env.JWT_SECRET ?? 'secret');
    return NextResponse.next();
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};