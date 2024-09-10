'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import {
  SessionWithProviderData,
  SessionWithUpdateData,
  ErrorForRedirect,
  DbUser,
  CredentialsLoginSchema,
  CredentialsRegistrationSchema
} from '@/types';
import { auth, signOut, unstable_update} from '@/lib/next-auth';
import { convertErrorZodResultToMsgArray } from '@/utils/zod';
import { revalidateProfilePath } from '@/utils/cache';
import { ERRORS, ExtendedError } from '@/utils/errors';
import pg from '@/lib/postgres/queries';

export async function authorizeUser() {
  let session = await auth() as SessionWithProviderData;

  const providerData = session?.user?.provider_data;
  const authProvider = session?.user?.iss;

  if (!session || !providerData) {
    return signOut({
      redirectTo:  `/page/auth?error=${ERRORS.authFailed[1]}&code=${ERRORS.authFailed[0]}`
    });
  }

  let isRegistrationPage = false;
  let authError: ErrorForRedirect = null;
  let dbUser: DbUser | undefined = undefined;

  /* =============================================================
  Credentials authorization passing
  ============================================================= */

  if (authProvider === 'credentials') {
    try {
      const { name, email, password, form_url } = providerData;

      if (typeof form_url === 'string' && form_url.includes('method=registration')) {
        isRegistrationPage = true;
      }

      // Registration form
      if (isRegistrationPage) {
        const result = CredentialsRegistrationSchema.safeParse({ name, email, password });
      
        // Throw error if validation fails
        if (!result.success) {
          const errorMessages = convertErrorZodResultToMsgArray(result);
          throw new ExtendedError(400, errorMessages.join(' | '));

        // Process user credentials
        } else {
          dbUser = await pg.getUserByAuthEmail(result.data.email);

          // Found existing user -> throw error
          // User not found -> new user registration
          if (dbUser) {
            throw new ExtendedError(...ERRORS.userAlreadyExists);

          } else {
            dbUser = await pg.createUserByAuthEmail(
              result.data.email,
              result.data.password,
              result.data.name
            );

            if (!dbUser) {
              throw new ExtendedError(...ERRORS.userCreatingFailed);
            } else {
              // all ok, revalidate cache
              revalidateProfilePath(dbUser);
            }
          }
        }
      }

      // Login form
      if (!isRegistrationPage) {
        const result = CredentialsLoginSchema.safeParse({ email, password });
      
        // Throw error if validation fails
        if (!result.success) {
          const errorMessages = convertErrorZodResultToMsgArray(result);
          throw new ExtendedError(400, errorMessages.join(' | '));

        // Process user credentials
        } else {
          dbUser = await pg.getUserByAuthEmail(result.data.email);

          if (!dbUser) {
            throw new ExtendedError(...ERRORS.userNotFound);

          } else {
            const match = await bcrypt.compare(
              result.data.password,
              dbUser.auth_password
            );

            if (!match) {
              throw new ExtendedError(...ERRORS.invalidPassword);
            } else {
              // all ok, revalidate cache
              revalidateProfilePath(dbUser);
            }
          }
        }
      }

    } catch (error: any) {
      authError = {
        message: error?.message || 'Unknown error',
        code: error?.code || 500
      };
    }
  }

  /* =============================================================
  OAuth authorization passing
  ============================================================= */

  const changeGoogleAvatarSize = (imageUrl: any) => {
    return typeof imageUrl === 'string'
      ? imageUrl.replace('w=s96-c', 'w=s512-c')
      : imageUrl;
  };

  if (authProvider === 'google' || authProvider === 'github') {
    let userId = null;
    let userName = null;
    let userAvatar = null;

    const { sub, name, picture, id, login, avatar_url } = providerData;

    switch (authProvider) {
      case 'google':
        userId = sub;
        userName = name;
        userAvatar = changeGoogleAvatarSize(picture);
        break;
      case 'github':
        userId = String(id);
        userName = login;
        userAvatar = avatar_url;
        break;
    }

    if (!userId || !userName || !userAvatar) {
      throw new ExtendedError(...ERRORS.invalidOAuthInfo);

    } else {
      try {
        dbUser = await pg.getUserByAuthId(authProvider, userId);

        if (!dbUser) {
          dbUser = await pg.createUserByAuthId(authProvider, userId, userName, userAvatar);

          if (!dbUser) {
            throw new ExtendedError(...ERRORS.userCreatingFailed);
          } else {
            // all ok, revalidate cache
            revalidateProfilePath(dbUser);
          }
        }

      } catch (error: any) {
        authError = {
          message: error?.message || 'Unknown error',
          code: error?.code || 500
        };
      }
    }
  }

  /* =============================================================
  Update session (on success)
  ============================================================= */

  if (!authError && dbUser) {
    const updateData: SessionWithUpdateData = {
      user: {
        replace_data: {
          uuid: dbUser.uuid,
          avatar: dbUser.avatar,
          alias: dbUser.alias_custom || dbUser.alias_default,
          name: dbUser.name,
          is_admin: dbUser.is_admin,
          iss: authProvider
        }
      }
    };

    await unstable_update(updateData);
  }

  /* =============================================================
  Redirect to auth form (on failure) or profile (on success)
  ============================================================= */

  if (authError) {
    const method = `method=${isRegistrationPage ? 'registration' : 'login'}`;
    const error = `error=${authError.message}`;
    const code = `code=${authError.code}`;

    return signOut({
      redirectTo: `/page/auth?${method}&${error}&${code}`
    });
  }

  redirect('/page/profile/me');
}