'use server';

import { redirect } from 'next/navigation';

import type { SessionWithBaseData, ErrorForRedirect } from '@/types';
import { changeProfileImage } from './change-image';
import { auth } from '@/lib/next-auth';
import pg from '@/lib/postgres/queries';

export async function changeProfileCover(formData: FormData) {
  await changeProfileImage({ formData, imageToChange: 'cover' });
}

export async function deleteProfileCover() {
  const session = await auth() as SessionWithBaseData;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;

  let returnError: ErrorForRedirect = null;

  if (sessionUuid) {
    try {
      await pg.deleteProfileCover(sessionUuid);
      
    } catch (error: any) {
      returnError = {
        message: error?.message || 'Unknown error',
        code: error?.code || 500
      };
    }
  }

  const message = returnError?.message;
  const code = returnError?.code;

  const redirectUrl = message && code
    ? `/page/profile?error=${message}&code=${code}`
    : `/page/profile`;

  redirect(redirectUrl);
}