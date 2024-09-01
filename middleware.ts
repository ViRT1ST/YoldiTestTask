import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const session = !!req.cookies.get('authjs.session-token');

  if (!session) {
    return NextResponse.redirect(new URL(`/page/auth`, req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/page/profile/me']
};

