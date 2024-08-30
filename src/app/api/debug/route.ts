import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/next-auth';

export const GET = auth(async ({ auth }) => {
  // const session = await auth() as SessionWithBaseData;
  // const sessionUser = session?.user;
  // const sessionUuid = sessionUser?.uuid;
  console.log('ddd', auth?.user)

  return NextResponse.json({ user: auth?.user });
});
