'use server';

import dbQueries from '@/lib/db/queries';

export async function resetYoldiUsersTable() {
  await dbQueries.resetUsersTable();
}