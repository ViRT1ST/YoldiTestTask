import { auth } from '@/lib/auth/next-auth';


import AuthServerButtons from '@/components/debug/auth-server-buttons';
import WhoAmIServerAction from '@/components/debug/whoami-sa';
import WhoAmIAPI from '@/components/debug/whoami-api';
import WhoAmIRSC from '@/components/debug/whoami-rsc';

export const metadata = {
  title: 'Debug Page',
};

export default async function TestPage() {
  const session = await auth();

  async function onGetUserAction() {
    'use server';
    const session = await auth() as any;
    return session?.user?.name || session?.user?.profile_name;
  }

  return (
    <main className="px-10">
      <h1 className="text-3xl mb-5">Debug Page</h1>
      <div>--------</div>
      <pre>*SESSION*<br/>{JSON.stringify(session, null, 2)}</pre>
      <div>--------</div>
      <WhoAmIServerAction onGetUserAction={onGetUserAction} />
      <WhoAmIAPI />
      <WhoAmIRSC />
      <div className="mt-20">-----------------------------</div>
      <AuthServerButtons />
    </main>
  );
}
