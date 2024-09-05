'use server';

import pg from '@/lib/postgres/queries';

export async function resetUsersTable() {
  await pg.resetUsersTable();
}