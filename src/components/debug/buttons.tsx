'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as actions from '@/actions';

type DebugButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string
};

function DebugButton({ onClick, label }: DebugButtonProps) {
  return (
    <button className="block mx-3 my-3 px-2 py-1 border rounded" onClick={onClick}>
      {label}
    </button>
  );
}

export default function Buttons() {
  const router = useRouter();

  const session = useSession();
  const user = session?.data?.user;
  const name = user?.name;

  const debugPage = '/page/debug';
  const authPage = '/page/auth';

  const [ loggedIn, setIsLoggedIn ] = useState(false);

  useEffect(() => {
    if (name) {
      setIsLoggedIn(true);
    }
  }, [name]);

  return (
    <div className="mb-20">

      {loggedIn ? (
        <DebugButton
          label={`${name}: [Sign out]`}
          onClick={() => {
            setIsLoggedIn(false);
            actions.signOutWithRedirectToPath(debugPage);
          }}
        />
      ) : (
        <DebugButton
          label="Go to auth page"
          onClick={() => router.push(authPage)}
        />
      )}

      <DebugButton
        label="Auth with Google"
        onClick={() => actions.googleSignIn()}
      
      />

      <DebugButton
        label="Auth with GitHub"
        onClick={() => actions.githubSignIn()}
      />

      <DebugButton
        label="Reset users table to defaults"
        onClick={() => {
          setIsLoggedIn(false);
          actions.resetUsersTable();
          actions.signOutWithRedirectToPath(debugPage);
        }}
      />

    </div>
  );
}




