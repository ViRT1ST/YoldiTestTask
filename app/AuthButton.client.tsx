'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from '@/lib/auth/helpers';

export default function AuthButton() {
  const session = useSession();

  const onClick = async () => {
    await signOut();
    await signIn();
  };


  return session?.data?.user ? (
    <button className="block" onClick={onClick}>
      {session.data?.user?.name} : [Sign Out]
    </button>
  ) : (
    <button onClick={async () => await signIn()}>Sign In</button>
  );
}