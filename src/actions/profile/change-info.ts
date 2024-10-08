'use server';

import { redirect } from 'next/navigation';

import {
  ProfileNewInfo,
  SessionWithBaseData,
  SessionWithUpdateData,
  ErrorForRedirect,
  UpdateProfileSchema
} from '@/types';
import { auth, unstable_update  } from '@/lib/next-auth';
import { convertErrorZodResultToMsgArray } from '@/utils/zod';
import { revalidateProfilePath } from '@/utils/cache';
import { ERRORS, ExtendedError } from '@/utils/errors';
import pg from '@/lib/postgres/queries';

export async function changeProfileInfo(newInfo: ProfileNewInfo) {
  const session = await auth() as SessionWithBaseData | null;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;
  const sessionAlias = sessionUser?.alias;

  let returnError: ErrorForRedirect = null;

  if (sessionUuid) {
    try {
      const result = UpdateProfileSchema.safeParse(newInfo);

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
        const userWithSameAlias = await pg.getUserByAlias(fixedAlias);
        const isNotSameUser = sessionUuid !== userWithSameAlias?.uuid;

        if (userWithSameAlias?.alias_custom && isNotSameUser) {
          throw new ExtendedError(...ERRORS.notAllowedAlias);
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
          throw new ExtendedError(...ERRORS.invalidAlias);
        }

        if (!isSameAliasAsSession) {
          newInfo.alias = fixedAlias;
        }

        // Update user profile
        const dbUser = await pg.updateProfileInfo(newInfo);

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