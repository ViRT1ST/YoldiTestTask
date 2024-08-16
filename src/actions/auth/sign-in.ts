'use server';

import * as auth from '@/lib/auth/next-auth';

const pathToAuthProcessor = '/yoldi/auth/pass';

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
    redirectTo: pathToAuthProcessor,
    redirect: true,
    ...userData
  });
}

export async function githubSignIn() {
  return auth.signIn('github', {
    redirectTo: pathToAuthProcessor,
    redirect: true,
  });
}

export async function googleSignIn() {
  return auth.signIn('google', {
    redirectTo: pathToAuthProcessor,
    redirect: true,
  });
}