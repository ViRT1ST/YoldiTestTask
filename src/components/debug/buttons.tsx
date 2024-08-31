'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as actions from '@/actions';

type AuthButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string
};

function DebugButton({ onClick, label }: AuthButtonProps) {
  return (
    <button className="block mx-2 my-2 px-2 py-1 border rounded" onClick={onClick}>
      {label}
    </button>
  );
}

export default function Buttons() {
  const router = useRouter();

  const session = useSession();
  const user = session?.data?.user;
  const name = user?.name;

  useEffect(() => {
    if (!user) {
      router.push('/debug');
    }
  }, [session]);

  return (
    <div className="mb-20">
      {user ? (
        <DebugButton
          label={`${name}: [Sign Out]`}
          onClick={() => actions.signOutWithRedirectToPath('/debug')}
        />
      ) : (
        <DebugButton
          label="Go To Sign In Page"
          onClick={() => router.push('/yoldi/auth')}
        />
      )}

      <DebugButton label="Auth With Google" onClick={() => actions.googleSignIn()} />
      <DebugButton label="Auth With GitHub" onClick={() => actions.githubSignIn()} />

      <DebugButton label="Reset Users Table" onClick={async () => {
        await actions.resetYoldiUsersTable();
        await actions.signOut();
      }} />
    </div>
  );
}




