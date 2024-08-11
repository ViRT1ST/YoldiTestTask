// import { SessionProvider } from 'next-auth/react';
import { BASE_PATH, auth } from '@/lib/auth/next-auth';

import AuthButtonClient from '@/components/debug/AuthButton.client';
import { GithubSignInButton, GoogleSignInButton } from '@/components/debug/AuthSocialButtons';

export default async function AuthButton() {
  // const session = await auth();
  // if (session && session.user) {
  //   session.user = {
  //     name: session.user.name,
  //     email: session.user.email,
  //   };
  // }

  return (
    <>
    {/* <SessionProvider basePath={BASE_PATH} session={session}> */}
      <AuthButtonClient />
      <GoogleSignInButton />
      <GithubSignInButton />
    {/* </SessionProvider> */}
    </>
  );
}