'use server';

import dbQueries from '@/lib/db/queries';

export async function resetUsersTable() {
  await dbQueries.resetUsersTable();
}