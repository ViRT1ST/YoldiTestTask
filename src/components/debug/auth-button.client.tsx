'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
// import { signIn, signOut } from '@/lib/auth/helpers';

export default function AuthButton() {
  const session = useSession() as any;

  const onClick = async () => {
    await signOut();
    await signIn();
  };


  return session?.data?.user ? (
    <button className="block border mx-2 my-2 px-2 py-1" onClick={onClick}>
      {session.data?.user?.name || session.data?.user?.profile_name} : [Sign Out]
    </button>
  ) : (
    <button className="block border mx-2 my-2 px-2 py-1" onClick={async () => await signIn()}>
      Go To Sign In Page
    </button>
  );
}