'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import type {
  ProfileNewInfo,
  SessionWithBaseData,
  SessionWithUpdateData,
  ErrorForRedirect
} from '@/types';
import { auth, unstable_update  } from '@/lib/auth/next-auth';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';
import { revalidateProfilePath } from '@/lib/cache/revalidate';
import { ExtendedError } from '@/errors';
import dbQueries from '@/lib/db/queries';

export async function changeProfileInfo(newInfo: ProfileNewInfo) {
  const session = await auth() as SessionWithBaseData;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;
  const sessionAlias = sessionUser?.alias;

  let returnError: ErrorForRedirect = null;

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
        .optional()
        .or(z.literal('')),
      about: z
        .string()
        .min(1, { message: 'About must be at least 1 characters'})
    });

    try {
      const result = updateInfoSchema.safeParse(newInfo);

      // Throw error if validation fails
      if (!result.success) {
        const errorMessages = convertErrorZodResultToMsgArray(result);
        throw new ExtendedError(400, errorMessages.join(' | '));

      // Process user data
      } else {
        const { name, alias, about } = result.data;
        const fixedAbout = about.replace(/\s+/g, ' ');
        const fixedAlias = alias && alias.toLowerCase() || sessionAlias as string;

        // Find user with same custom alias
        const userWithSameAlias = await dbQueries.getUserByAlias(fixedAlias);
        const isNotSameUser = sessionUuid !== userWithSameAlias?.uuid;
        if (userWithSameAlias?.alias_custom && isNotSameUser) {
          throw new ExtendedError(400, 'URL alias already in use');
        }

        const newInfo: ProfileNewInfo = {
          uuid: sessionUuid,
          name: name,
          about: fixedAbout,
        };

        // Validate URL alias
        const isValidAlias = /^[^id][a-zA-Z0-9]+$/.test(fixedAlias);
        const isSameAliasAsSession = fixedAlias === sessionAlias;

        if (!isSameAliasAsSession && !isValidAlias) {
          throw new ExtendedError(
            400, 'URL alias must contain only letters and numbers and cannot start with "id"'
          );
        }

        if (!isSameAliasAsSession) {
          newInfo.alias = fixedAlias;
        }

        // Update user profile
        const dbUser = await dbQueries.updateProfileInfo(newInfo);

        // Revalidate cache
        if (dbUser) {
          revalidateProfilePath(dbUser);
        }

        const updateData: SessionWithUpdateData = {
          user: {
            replace_data: {
              ...sessionUser,
              name: name,
              alias: newInfo?.alias || sessionAlias,
            }
          }
        };

        await unstable_update(updateData);
      }
      
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