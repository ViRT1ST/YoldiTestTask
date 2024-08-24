'use server';

import { redirect } from 'next/navigation';

import type { SessionWithBaseData, ErrorForRedirect } from '@/types';
import { changeProfileImage } from '@/actions/profile/change-image';
import { auth } from '@/lib/auth/next-auth';
import dbQueries from '@/lib/db/queries';

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
      await dbQueries.deleteProfileCover(sessionUuid);
      
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
    ? `/yoldi/profile?error=${message}&code=${code}`
    : `/yoldi/profile`;

  redirect(redirectUrl);
}