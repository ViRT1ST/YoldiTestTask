import { redirect } from 'next/navigation';

import { IS_DEV_MODE  } from '@/config/public';
import * as actions from '@/actions';

export default async function MainPage() {
  if (!IS_DEV_MODE) {
    await actions.resetUsersTable();
  }

  redirect('/page/accounts');
}
