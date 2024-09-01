'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import type {
  SessionWithProviderData,
  SessionWithUpdateData,
  ErrorForRedirect,
  DbUser
} from '@/types';
import { auth, signOut, unstable_update} from '@/lib/auth/next-auth';
import { convertErrorZodResultToMsgArray } from '@/lib/utils/index';
import { ExtendedError } from '@/errors';
import dbQueries from '@/lib/db/queries';


const defaultError = { message: 'Failed to authenticate', code: 401 };

export async function authorizeUser() {
  let session = await auth() as SessionWithProviderData;

  if (!session) {
    return signOut({
      redirectTo: `/page/auth?error=${defaultError.message}&code=${defaultError.code}`
    });
  }

  const providerData = session?.user?.provider_data;
  const authProvider = session?.user?.iss;

  if (!providerData) {
    return signOut({
      redirectTo: `/page/auth?error=${defaultError.message}&code=${defaultError.code}`
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
          dbUser = await dbQueries.getUserByAuthEmail(result.data.email);

          // Found existing user -> throw error
          // User not found -> new user registration
          if (dbUser) {
            throw new ExtendedError(400, 'User already exists');

          } else {
            dbUser = await dbQueries.createUserByAuthEmail(
              result.data.email,
              result.data.password,
              result.data.name
            );

            if (!dbUser) {
              throw new ExtendedError(400, 'Error creating new user');
            } else {
              // all ok, revalidate cache
              revalidatePath(`/page/profile/${dbUser.alias_default}`);
              if (dbUser.alias_custom) {
                revalidatePath(`/page/profile/${dbUser.alias_custom}`);
              }
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
          dbUser = await dbQueries.getUserByAuthEmail(result.data.email);

          if (!dbUser) {
            throw new ExtendedError(400, 'User not found');

          } else {
            const match = await bcrypt.compare(
              result.data.password,
              dbUser.auth_password
            );

            if (!match) {
              throw new ExtendedError(400, 'Password is invalid');
            } else {
              // all ok, revalidate cache
              revalidatePath(`/page/profile/${dbUser.alias_default}`);
              if (dbUser.alias_custom) {
                revalidatePath(`/page/profile/${dbUser.alias_custom}`);
              }
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
          } else {
            // all ok, revalidate cache
            revalidatePath(`/page/profile/${dbUser.alias_default}`);
            if (dbUser.alias_custom) {
              revalidatePath(`/page/profile/${dbUser.alias_custom}`);
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
    const error = `error=${authError?.message}`;
    const code = `code=${authError.code}`;

    return signOut({
      redirectTo: `/page/auth?${method}&${error}&${code}`
    });
  }

  redirect('/page/profile/me');
}