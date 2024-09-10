'use server';

import { revalidatePath } from 'next/cache';
import type { DbUser } from '@/types';

export async function revalidateProfilePath(dbUser: DbUser) {
  revalidatePath(`/page/profile/${dbUser.alias_default}`);
  if (dbUser.alias_custom) {
    revalidatePath(`/page/profile/${dbUser.alias_custom}`);
  }
}