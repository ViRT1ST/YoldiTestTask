'use server';

import * as auth from '@/lib/auth/next-auth';

export async function signOut() {
  return auth.signOut();
}

