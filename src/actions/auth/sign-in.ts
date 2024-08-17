'use server';

import * as auth from '@/lib/auth/next-auth';

const PATH_TO_AUTH_PROCESSOR = '/yoldi/auth/pass';

export async function redirectToAuthPage() {
  return auth.signIn();
}

export async function credetialsSignIn(additionalData: object, formData: FormData) {
  const userData = {
    name: formData.get('name') || null,
    email: formData.get('email'),
    password: formData.get('password'),
    ...additionalData
  };

  return auth.signIn('credentials', {
    redirectTo: PATH_TO_AUTH_PROCESSOR,
    redirect: true,
    ...userData
  });
}

export async function githubSignIn() {
  return auth.signIn('github', {
    redirectTo: PATH_TO_AUTH_PROCESSOR,
    redirect: true,
  });
}

export async function googleSignIn() {
  return auth.signIn('google', {
    redirectTo: PATH_TO_AUTH_PROCESSOR,
    redirect: true,
  });
}