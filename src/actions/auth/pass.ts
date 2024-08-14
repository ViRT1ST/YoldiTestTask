'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth, signOut, unstable_update} from '@/lib/auth/next-auth';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';
import type { UserWithExtraData } from '@/types';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';

const defaultError = { message: 'Failed to authenticate', code: 401 };

export async function authorizeUser() {
  const session = await auth();
  const sessionUser = session?.user as UserWithExtraData;

  if (!sessionUser?.provider_data) {
    return signOut({
      redirectTo: `/yoldi/auth?error=${defaultError.message}&code=${defaultError.code}`
    });
  }

  const authProvider = sessionUser?.iss;

  let isRegistrationPage = false;
  let authError: any = null;
  let dbUser: any = null;

  /* =============================================================
  Credentials authorization passing
  ============================================================= */

  if (authProvider === 'credentials') {
    try {
      const { name, email, password, formUrl } = sessionUser.provider_data;

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
          validator.throwError(400, errorMessages.join(' | '));

        // Process user credentials
        } else {
          dbUser = await pg.getUserByAuthEmail(email as string);

          // Found existing user -> throw error
          // User not found -> new user registration
          if (dbUser) {
            validator.throwError(400, 'User already exists');

          } else {
            dbUser = await pg.createUserByAuthEmail(
              email as string,
              password as string,
              name as string
            );

            if (!dbUser) {
              validator.throwError(400, 'Error creating new user');
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
          validator.throwError(400, errorMessages.join(' | '));
        
        // Process user credentials
        } else {
          dbUser = await pg.getUserByAuthEmail(email as string);

          if (!dbUser) {
            validator.throwError(400, 'User not found');

          } else {
            const match = await bcrypt.compare(
              password as string,
              dbUser.credentials_password
            );

            if (!match) {
              validator.throwError(400, 'Password is invalid');
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

  const changeGoogleAvatarSize = (imageUrl: string) => {
    return typeof imageUrl === 'string'
      ? imageUrl.replace('w=s96-c', 'w=s512-c')
      : imageUrl;
  };

  if (authProvider === 'google' || authProvider === 'github') {
    let userId = null;
    let userName = null;
    let userAvatar = null;

    switch (authProvider) {
      case 'google':
        userId = sessionUser.provider_data?.sub;
        userName = sessionUser.provider_data?.name;
        userAvatar = changeGoogleAvatarSize(sessionUser.provider_data?.picture);
        break;
      case 'github':
        userId = String(sessionUser.provider_data?.id);
        userName = sessionUser.provider_data?.login;
        userAvatar = sessionUser.provider_data?.avatar_url;
        break;
    }
    if (!userId || !userName || !userAvatar) {
      const msgIss = authProvider.charAt(0).toUpperCase() + authProvider.slice(1);
      validator.throwError(400, `Invalid user info from your ${msgIss} account`);

    } else {
      try {
        dbUser = await pg.getUserByAuthId(authProvider, userId);

        if (!dbUser) {
          dbUser = await pg.createUserByAuthId(authProvider, userId, userName, userAvatar);

          if (!dbUser) {
            validator.throwError(400, 'Error creating new user');
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
        name: dbUser.profile_name,
        email: null,
        sub: null,
        picture: null,
        provider_data: null,
        db_data: {
          uuid: dbUser.uuid,
          profile_avatar: dbUser.profile_avatar,
          profile_url: dbUser.profile_url_custom || dbUser.profile_url_default,
          profile_name: dbUser.profile_name,
          is_admin: dbUser.is_admin,
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