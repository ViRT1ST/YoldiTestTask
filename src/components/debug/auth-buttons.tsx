'use client';

import { useSession } from 'next-auth/react';

import {
  redirectToAuthPage,
  googleSignIn,
  githubSignIn,
  signOut
} from '@/actions';

export default function AuthButtons() {
  const session = useSession() as any;
  const user = session?.data?.user;
  const name = user?.db_data?.profile_name || user?.name;

  return (
    <div className="mb-20">
      {user ? (
        <AuthButton label={`${name}: [Sign Out]`} onClick={() => signOut()} />
      ) : (
        <AuthButton label="Go To Sign In Page" onClick={() => redirectToAuthPage()} />
      )}

      <AuthButton label="Auth With Google" onClick={() => googleSignIn()} />
      <AuthButton label="Auth With GitHub" onClick={() => githubSignIn()} />
    </div>
  );
}

function AuthButton({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <button className="block mx-2 my-2 px-2 py-1 border rounded" onClick={onClick}>
      {label}
    </button>
  );
}


