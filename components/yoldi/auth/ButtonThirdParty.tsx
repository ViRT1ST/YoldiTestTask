'use client';

import { signIn } from 'next-auth/react';

import { AUTH_SUCCESS_REDIRECT } from '@/lib/constants';
import ButtonLarge from '@/components/yoldi/ui/ButtonLarge';

export default function ButtonThirdParty({
  label,
  provider
}: {
  label: string;
  provider: string;
}) {
  return (
    <ButtonLarge
      className="w-full border-[#D4D4D4] hover:border-[#838383]"
      type="button"
      light={true}
      title={`Войти через ${label}`}
      onClick={async () => await signIn(
        provider, {
          redirect: true,
          callbackUrl: AUTH_SUCCESS_REDIRECT
        }
      )}
    >
      {label}
    </ButtonLarge>
  );
}
