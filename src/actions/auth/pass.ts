'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth, signOut, unstable_update} from '@/lib/auth/next-auth';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';
import { ExtendedError } from '@/errors';
import type { SessionWithExtraData } from '@/types';
import dbQueries from '@/lib/db/queries';

const defaultError = { message: 'Failed to authenticate', code: 401 };

export async function authorizeUser() {
  const session = await auth() as SessionWithExtraData;
  const providerData = session?.user?.provider_data;
  const authProvider = session?.user?.iss;

  if (!providerData) {
    return signOut({
      redirectTo: `/yoldi/auth?error=${defaultError.message}&code=${defaultError.code}`
    });
  }

  let isRegistrationPage = false;
  let authError: any = null;
  let dbUser: any = null;

  /* =============================================================
  Credentials authorization passing
  ============================================================= */

  if (authProvider === 'credentials') {
    try {
      const { name, email, password, formUrl } = providerData;

      if (typeof formUrl === 'string' && formUrl.includes('method=registration')) {
        isRegistrationPage = true;
      }

      // Registration form
      if (isRegistrationPage) {
        const registrationSchema = z.object({
          name: z
            .string()
            .min(3, { message: 'Name must be at least 5 characters'}),
          email: z
            .string()
            .email({ message: 'Valid email is required'})
            .min(5, { message: 'Email must be at least 5 characters'}),
          password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters'})
        });

        const result = registrationSchema.safeParse({ name, email, password });
      
        // Throw error if validation fails
        if (!result.success) {
          const errorMessages = convertErrorZodResultToMsgArray(result);
          throw new ExtendedError(400, errorMessages.join(' | '));

        // Process user credentials
        } else {
          dbUser = await dbQueries.getUserByAuthEmail(email as string);

          // Found existing user -> throw error
          // User not found -> new user registration
          if (dbUser) {
            throw new ExtendedError(400, 'User already exists');

          } else {
            dbUser = await dbQueries.createUserByAuthEmail(
              email as string,
              password as string,
              name as string
            );

            if (!dbUser) {
              throw new ExtendedError(400, 'Error creating new user');
            }
          }
        }
      }

      // Login form
      if (!isRegistrationPage) {
        const loginSchema = z.object({
          email: z
            .string()
            .email({ message: 'Valid email is required'})
            .min(5, { message: 'Email must be at least 5 characters'}),
          password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters'})
        });

        const result = loginSchema.safeParse({ email, password });
      
        // Throw error if validation fails
        if (!result.success) {
          const errorMessages = convertErrorZodResultToMsgArray(result);
          throw new ExtendedError(400, errorMessages.join(' | '));

        // Process user credentials
        } else {
          dbUser = await dbQueries.getUserByAuthEmail(email as string);

          if (!dbUser) {
            throw new ExtendedError(400, 'User not found');

          } else {
            const match = await bcrypt.compare(
              password as string,
              dbUser.auth_password
            );

            if (!match) {
              throw new ExtendedError(400, 'Password is invalid');
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
      const msgIss = authProvider.charAt(0).toUpperCase() + authProvider.slice(1);
      throw new ExtendedError(400, `Invalid user info from your ${msgIss} account`);

    } else {
      try {
        dbUser = await dbQueries.getUserByAuthId(authProvider, userId);

        if (!dbUser) {
          dbUser = await dbQueries.createUserByAuthId(authProvider, userId, userName, userAvatar);

          if (!dbUser) {
            throw new ExtendedError(400, 'Error creating new user');
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
    await unstable_update({
      user: {
        // name: null,
        // email: null,
        // sub: null,
        // picture: null,
        // provider_data: null,
        replace_data: {
          uuid: dbUser.uuid,
          avatar: dbUser.avatar,
          alias: dbUser.alias_custom || dbUser.alias_default,
          name: dbUser.name,
          is_admin: dbUser.is_admin,
          iss: authProvider
        }
      } as any
    });
  }

  /* =============================================================
  Redirect to auth form (on failure) or profile (on success)
  ============================================================= */

  if (authError) {
    const method = `method=${isRegistrationPage ? 'registration' : 'login'}`;
    const error = `error=${authError?.message}`;
    const code = `code=${authError.code}`;

    return signOut({
      redirectTo: `/yoldi/auth?${method}&${error}&${code}`
    });
  }

  redirect('/yoldi/profile/me');
}