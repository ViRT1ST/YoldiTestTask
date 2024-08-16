'use client';

import { SessionProvider } from 'next-auth/react';

interface BodyProvidersProps {
  children: React.ReactNode;
}

export default function BodyProviders({ children }: BodyProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}