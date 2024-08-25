'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import type { AuthConstants } from '@/types';
import { classesBeautify } from '@/lib/utils';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';

type Props = {
  authConstants: AuthConstants;
};

export default function Footer({ authConstants }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isAuthPage = pathname === authConstants.authPagePath;
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_STRING;

  const pageData = isRegistrationPage
    ? authConstants[LOGIN_STRING]
    : authConstants[REGISTRATION_STRING];

  if (isAuthPage) {
    return (
      <div className={twContainer}>
        <Link className={twLink} href={pageData.path}>
          <span className="text-[#838383]">{pageData.question}</span>
          <span className="font-medium">{pageData.label}</span>
        </Link>
      </div>
    );
  }

  return null;
}

const twContainer = classesBeautify(`
  h-[72px] flex flex-row justify-center items-center
  border-[#E6E6E6] border-t
  font-inter
`);

const twLink = classesBeautify(`
  flex flex-row gap-[4.5px]
  pb-0 xs:pb-[1px]
  pr-[1.5px] xs:pr-0
`);
