'use client';

import { signIn } from 'next-auth/react';
import clsx from 'clsx';

import { AUTH_SUCCESS_REDIRECT } from '@/lib/constants';
import { type AnyFieldsObject } from '@/lib/types';
import ButtonLarge from '@/components/yoldi/ui/ButtonLarge';

export default function ButtonCredentials({
  label,
  tooltip,
  isFieldsFilled,
  credentials,
}: {
  label: string;
  tooltip: string
  isFieldsFilled: boolean;
  credentials: AnyFieldsObject;
}) {
  return (
    <ButtonLarge
      className={clsx(!isFieldsFilled && 'bg-[#d4d4d4] text-[#f3f3f3]')}
      disabled={!isFieldsFilled}
      type="submit"
      light={false}
      title={tooltip}
      onClick={async () => await signIn(
        'credentials', {
          ...credentials,
          redirect: true,
          callbackUrl: AUTH_SUCCESS_REDIRECT
        }
      )}
    >
      {label}
    </ButtonLarge>
  );
}
