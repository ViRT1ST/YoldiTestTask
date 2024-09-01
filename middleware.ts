import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = !!req.cookies.get('authjs.session-token');

  // redirect if user is not logged (for matcher's urls) 
  if (!session) {
    // `/page/auth?callbackUrl=${path}`
    return NextResponse.redirect(new URL(`/page/auth`, req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/page/profile/me']
};

