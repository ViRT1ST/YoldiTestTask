import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const config = {
  matcher: [
    '/yoldi/profile',
  ],
};

export default auth((req) => {
  const session = req.auth;

  if (!session) {
    const reqUrl = req.url;
    const reqUrlEncoded = encodeURIComponent(req.url);

    const redirectUrl = `auth?callbackUrl=${reqUrlEncoded}`;

    return NextResponse.redirect(new URL(redirectUrl, reqUrl));
  }
});
