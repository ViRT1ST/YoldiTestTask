'use server';

import * as auth from '@/lib/auth/next-auth';

const authRedirect = '/yoldi/auth/pass';

export async function credetialsSignIn(additionalData: object, formData: FormData) {
  const userData = {
    name: formData.get('name') || null,
    email: formData.get('email'),
    password: formData.get('password'),
    ...additionalData
  };

  return auth.signIn('credentials', {
    redirectTo: authRedirect,
    redirect: true,
    ...userData
  });
}

export async function githubSignIn() {
  return auth.signIn('github', {
    redirectTo: authRedirect,
    redirect: true,
  });
}

export async function googleSignIn() {
  return auth.signIn('google', {
    redirectTo: authRedirect,
    redirect: true,
  });
}