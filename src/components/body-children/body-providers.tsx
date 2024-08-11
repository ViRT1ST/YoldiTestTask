'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider} from 'react-redux';
import store from '@/lib/frontend/store';

interface BodyProvidersProps {
  children: React.ReactNode;
}

export default function BodyProviders({ children }: BodyProvidersProps) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}