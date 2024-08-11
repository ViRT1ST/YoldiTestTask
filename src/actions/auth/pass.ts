'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';


import { auth, signOut, unstable_update} from '@/lib/auth/next-auth';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';
import type { userWithExtraData } from '@/types';

const defaultError = { message: 'Failed to authenticate', code: 401 };

export async function authorizeUser() {
  const session = await auth();
  const sessionUser = session?.user as userWithExtraData;

  if (!sessionUser?.provider_data) {
    return signOut({
      redirectTo: `/yoldi/auth?error=${defaultError.message}&code=${defaultError.code}`
    });
  }

  const authProvider = sessionUser?.iss;
  let authError: any = null;
  let isRegistrationPage = false;

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
        if (!name || !email || !password) {
          validator.throwError(400, 'Invalid registration data provided');
          // TODO: ^zod

        } else {
          const foundUser = await pg.getUserByAuthEmail(email);

          // Found existing user -> throw error
          // User not found -> new user registration
          if (foundUser) {
            validator.throwError(400, 'User already exists');
          } else {
            const newUser = await pg.createUserByAuthEmail(email, password, name);

            if (!newUser) {
              validator.throwError(400, 'Error creating new user');
            }

            authError = null;
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
        })

        const result = loginSchema.safeParse({ email, password });
      
        // Throw error if validation fails
        if (!result.success) {
          let errorMessages: string[] = [];

          const errors = result.error.flatten().fieldErrors;

          if (errors.email && errors.email.length > 0) {
            errorMessages = [ ...errorMessages, ...errors.email ];
          }

          if (errors.password && errors.password.length > 0) {
            errorMessages = [ ...errorMessages, ...errors.password ];
          }

          validator.throwError(400, errorMessages.join(' | '));
        
        // Process user credentials
        } else {
          const foundUser = await pg.getUserByAuthEmail(email as string);

          if (!foundUser) {
            validator.throwError(400, 'User not found');
          } else {
            const match = await bcrypt.compare(
              password as string,
              foundUser.credentials_password
            );

            if (!match) {
              validator.throwError(400, 'Password is invalid');
            }

            authError = null;
          }
        }
      }

      // TODO: Update session info
      await unstable_update({
        user: { name: `Serverserver-man__${Math.random()}` }
      });
    
    } catch (error: any) {
      authError = {
        message: error?.message || 'Unknown error',
        code: error?.code || 500
      };
    }
  }
  
  /* =============================================================
  Google authorization passing
  ============================================================= */

  if (authProvider === 'google') {
    // TODO: all for google 
    redirect('/debug');
  }

  /* =============================================================
  GitHub authorization passing
  ============================================================= */

  if (authProvider === 'github') {
    // TODO: all for github 
    redirect('/debug');
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

  redirect('/debug');
}