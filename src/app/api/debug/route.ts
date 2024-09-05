import { NextResponse } from 'next/server';
import { auth } from '@/lib/next-auth';

export const GET = auth(async ({ auth }) => {
  return NextResponse.json({ user: auth?.user });
});
