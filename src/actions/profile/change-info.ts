'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';

import { auth, unstable_update  } from '@/lib/auth/next-auth';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';
import { ExtendedError } from '@/errors';
import type { ProfileInfo, SessionWithExtraData } from '@/types';
import pg from '@/lib/db/postgres';

export async function changeProfileInfo(data: ProfileInfo) {
  const session = await auth() as SessionWithExtraData;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;

  let authError: any = null;

  if (sessionUuid) {
    const updateInfoSchema = z.object({
      name: z
        .string()
        .trim()
        .min(3, { message: 'Name must be at least 3 characters'}),
      alias: z
        .string()
        .trim()
        .min(3, { message: 'URL alias must be at least 3 characters'})
        .refine(
          (value) => /^[^id][a-zA-Z0-9]+$/.test(value ?? ''), {
            message: 'URL alias must contain only letters and numbers and cannot start with string "id"'
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
        throw new ExtendedError(400, errorMessages.join(' | '));

      // Process user data
      } else {
        const { name, alias, about } = result.data;
        const fixedAbout = about.replace(/\s+/g, ' ');
        const fixedAlias = alias.toLowerCase();

        await pg.updateProfile({
          uuid: sessionUuid,
          name: name,
          alias: fixedAlias,
          about: fixedAbout
        });

        await unstable_update({
          user: {
            user_replace_data: {
              ...sessionUser,
              name: name || sessionUser?.name,
              alias: fixedAlias || sessionUser?.alias
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