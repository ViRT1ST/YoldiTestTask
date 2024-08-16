'use client';

import { usePathname, useSearchParams  } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import Link from 'next/link';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import { AuthConstants } from '@/types';

interface FooterProps {
  authConstants: AuthConstants;
}

export default function Footer({ authConstants }: FooterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isRegistrationPage = searchParams.get('method') === REGISTRATION_STRING;
  const isAuthPage = pathname.includes(authConstants.authPageUrlPart);

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

const twContainer = twJoin(`
  h-[72px]
  flex flex-row justify-center items-center
  border-[#E6E6E6] border-t
  font-inter
`);

const twLink = twJoin(`
  flex flex-row gap-[4.5px]
  pb-0 xs:pb-[1px]
  pr-[1.5px] xs:pr-0
`);
