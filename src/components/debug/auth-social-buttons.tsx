'use client';

import { signIn } from 'next-auth/react';

export function GoogleSignInButton() {
  const onClick = async () => {
    const data = await signIn('google');
    console.log('data google: ', data);
  };

  return (
    <button onClick={onClick} className="block border mx-2 my-2 px-2 py-1">
      Auth With Google
    </button>
  );
}

export function GithubSignInButton() {
  const onClick = async () => {
    const data = await signIn('github');
    console.log('data github: ', data);
  };

  return (
    <button onClick={onClick} className="block border mx-2 my-2 px-2 py-1">
      Auth With Github
    </button>
  );
}

