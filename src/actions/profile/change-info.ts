'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { auth, unstable_update  } from '@/lib/auth/next-auth';
import type { ProfileInfo, UserWithExtraData } from '@/types';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';

// save data to db
// update session
// revalidate path

export async function changeProfileInfo(data: ProfileInfo) {
  const session = await auth();
  const sessionUser = session?.user as UserWithExtraData;
  const sessionUuid = sessionUser?.db_data?.uuid;

  let authError: any = null;

  if (sessionUuid) {
    const updateInfoSchema = z.object({
      name: z
        .string()
        .trim()
        .min(3, { message: 'Name must be at least 3 characters'}),
      idForUrl: z
        .string()
        .trim()
        .min(3, { message: 'URL ID must be at least 3 characters'})
        .refine(
          (value) => /^[^id][a-zA-Z0-9]+$/.test(value ?? ''), {
            message: 'URL ID must contain only letters and numbers and cannot start with string "id"'
        }),
        // .optional()
        // .or(z.literal('')),
      about: z
        .string()
        .min(1, { message: 'About must be at least 1 characters'})
    });

    try {
      const result = updateInfoSchema.safeParse(data);

      // Throw error if validation fails
      if (!result.success) {
        const errorMessages = convertErrorZodResultToMsgArray(result);
        validator.throwError(400, errorMessages.join(' | '));

      // Process user data
      } else {
        const { name, idForUrl, about } = result.data;
        const fixedAbout = about.replace(/\s+/g, ' ');
        const fixedIdForUrl = idForUrl.toLowerCase();

        await pg.updateProfile({
          uuid: sessionUuid,
          name: name,
          idForUrl: fixedIdForUrl,
          about: fixedAbout
        });

        await unstable_update({
          user: {
            db_data: {
              ...sessionUser?.db_data,
              profile_name: name || sessionUser?.db_data?.profile_name,
              profile_url: fixedIdForUrl || sessionUser?.db_data?.profile_url
            }
          }
        } as any);
      }
      
    } catch (error: any) {
      authError = {
        message: error?.message || 'Unknown error',
        code: error?.code || 500
      };
    }
  }

  const error = authError?.message;
  const code = authError?.code;

  const redirectUrl = error && code
    ? `/yoldi/profile?error=${error}&code=${code}`
    : `/yoldi/profile`;

  redirect(redirectUrl);
}