import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = !!req.cookies.get('authjs.session-token');

  if (!session) {
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${path}`, req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/yoldi/profile/me']
};

