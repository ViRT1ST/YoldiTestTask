import { auth } from '@/lib/next-auth';

import DebugButtons from '@/components/debug/buttons';
import WhoAmIAPI from '@/components/debug/whoami-api';
import WhoAmIRSC from '@/components/debug/whoami-rsc';

export const metadata = {
  title: 'Debug Page',
};

export default async function DebugPage() {
  const session = await auth();

  return (
    <main className="px-10">
      <h1 className="text-3xl my-2">Debug Page</h1>
      <div>-------------------------------------------------</div>
      <pre>*SESSION*<br/>{JSON.stringify(session, null, 2)}</pre>
      <div>-------------------------------------------------</div>
      <WhoAmIAPI />
      <WhoAmIRSC />
      <div>-------------------------------------------------</div>
      <DebugButtons />
    </main>
  );
}
