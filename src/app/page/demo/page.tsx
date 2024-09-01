import { redirect } from 'next/navigation';
import * as actions from '@/actions';

export const metadata = {
  title: 'Yoldi Main Page',
};

export default async function MainPage() {
  await actions.resetUsersTable();
  redirect('/page/accounts');
}

