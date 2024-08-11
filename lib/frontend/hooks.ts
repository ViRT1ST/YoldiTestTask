import { useSession } from 'next-auth/react';

export function useIsUserAuthenticated() {
  const session = useSession();
  
  return {
    isUserAuthenticated: Boolean(session?.data?.user?.id)
  };
};

