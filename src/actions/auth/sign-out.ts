'use server';

import * as auth from '@/lib/auth/next-auth';

export async function signOut() {
  return auth.signOut();
}

export async function signOutWithRedirectToAuthPage() {
  return auth.signOut({
    redirectTo: '/yoldi/auth',
    redirect: true,
  });
}

export async function signOutWithRedirectToPath(path: string) {
  return auth.signOut({
    redirectTo: path,
    redirect: true,
  });
}

