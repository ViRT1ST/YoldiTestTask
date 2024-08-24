'use client';

import { useSession } from 'next-auth/react';
import * as actions from '@/actions';

function AuthButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="block mx-2 my-2 px-2 py-1 border rounded" onClick={onClick}>
      {label}
    </button>
  );
}

export default function AuthButtons() {
  const session = useSession();
  const user = session?.data?.user;
  const name = user?.name;

  return (
    <div className="mb-20">
      {user ? (
        <AuthButton label={`${name}: [Sign Out]`} onClick={() => actions.signOut()} />
      ) : (
        <AuthButton label="Go To Sign In Page" onClick={() => actions.redirectToAuthPage()} />
      )}

      <AuthButton label="Auth With Google" onClick={() => actions.googleSignIn()} />
      <AuthButton label="Auth With GitHub" onClick={() => actions.githubSignIn()} />
    </div>
  );
}




