import { auth } from '@/lib/auth/next-auth';


import AuthServerButtons from '@/components/debug/AuthServerButtons';
import WhoAmIServerAction from '@/components/debug/WhoAmIServerAction';
import WhoAmIAPI from '@/components/debug/WhoAmIAPI';
import WhoAmIRSC from '@/components/debug/WhoAmIRSC';

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
