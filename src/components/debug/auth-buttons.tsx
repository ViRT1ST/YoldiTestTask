'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as actions from '@/actions';

type AuthButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string
};

function AuthButton({ onClick, label }: AuthButtonProps) {
  return (
    <button className="block mx-2 my-2 px-2 py-1 border rounded" onClick={onClick}>
      {label}
    </button>
  );
}

export default function AuthButtons() {
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
        <AuthButton
          label={`${name}: [Sign Out]`}
          onClick={() => actions.signOutWithRedirectToPath('/debug')}
        />
      ) : (
        <AuthButton
          label="Go To Sign In Page"
          onClick={() => router.push('/yoldi/auth')}
        />
      )}

      <AuthButton label="Auth With Google" onClick={() => actions.googleSignIn()} />
      <AuthButton label="Auth With GitHub" onClick={() => actions.githubSignIn()} />
    </div>
  );
}




