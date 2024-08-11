'use server';

import { redirect } from 'next/navigation';
import { User } from 'next-auth';
import bcrypt from 'bcryptjs';

import * as auth from '@/lib/auth/next-auth';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';
import type { userWithExtraData } from '@/types';

export async function credetialsForm() {
  console.log('credetials Form');

  return auth.signIn('credentials', {
    redirectTo: 'http://localhost:3000/yoldi/auth/pass',
    redirect: true,
    name: 'George',
    email: 'example@gmail.com',
    password: 'password123!',
    formUrl: 'yoldi/auth?method=login'
  });
}

export async function githubForm() {
  console.log('github Form');

  return auth.signIn('github', {
    redirectTo: 'http://localhost:3000/yoldi/auth/pass',
    redirect: true,
  });
}

export async function googleForm() {
  console.log('google Form');

  return auth.signIn('google', {
    redirectTo: 'http://localhost:3000/yoldi/auth/pass',
    redirect: true,
  });
}

export async function authorizeUser() {
  const session = await auth.auth();
  const user = session?.user as userWithExtraData;

  let redirectError: any = null;
  // redirect('/debug');

  if (!user?.provider_data) {
    redirectError = { message: 'Failed to authenticate', code: 401 };
  }

  const currentProvider = user?.iss;

  

  if (currentProvider === 'credentials' && user?.provider_data) {
    try {
      const { name, email, password, formUrl } = user.provider_data;
      const isRegistrationPage = formUrl?.includes('method=registration');


      // Registration form
      if (isRegistrationPage) {
        if (!name || !email || !password) {
          validator.throwError(400, 'Invalid registration data provided');

        } else {
          const foundUser = await pg.getUserByAuthEmail(email);

          // found existing user -> throw error
          // user not found -> new user registration
          if (foundUser) {
            validator.throwError(400, 'User already exists');
          } else {
            const newUser = await pg.createUserByAuthEmail(email, password, name);

            if (!newUser) {
              validator.throwError(400, 'Error creating new user');
            }

            redirectError = null;
          }
        }
      }

      // Login form
      if (!isRegistrationPage) {
        if (!email || !password) {
          validator.throwError(400, 'Invalid login data provided');
        } else {
          const foundUser = await pg.getUserByAuthEmail(email);

          // user not found -> throw error
          // found existing user -> check password
          if (!foundUser) {
            validator.throwError(400, 'User not found');
          } else {
            const match = await bcrypt.compare(password, foundUser.credentials_password);

            if (!match) {
              validator.throwError(400, 'Invalid password');
            }

            redirectError = null;
          }
        }
      }

      await auth.unstable_update({
        user: { name: `Serverserver-man__${Math.random()}` }
      });
    
    } catch (error: any) {
      const message = error?.message || 'Unknown error';
      const code = error?.code || 500;
      redirectError = { message, code };
    }
  }

  // failed registration or login
  if (redirectError) {
    console.log('ddddddddd');
    console.log(redirectError);
    await auth.signOut({
      redirectTo: `/yoldi/auth?error=${redirectError.message}&code=${redirectError.code}`
    });
    // return redirect(`/yoldi/auth?error=${redirectError.message}&code=${redirectError.code}`);
  } else {
    redirect('/debug');
  }
}