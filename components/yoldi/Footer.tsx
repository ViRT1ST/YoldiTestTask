'use client';

import { usePathname, useSearchParams  } from 'next/navigation';
import tw from 'tailwind-styled-components';
import Link from 'next/link';

import { REGISTRATION_PAGE_STRING, LOGIN_PAGE_STRING } from '@/lib/constants';

export const constants = {
  [REGISTRATION_PAGE_STRING]: {
    LinkQuestion: 'Уже есть аккаунт?',
    linkText: 'Войти',
    linkPath: '/yoldi/auth?method=login',
  },
  [LOGIN_PAGE_STRING]: {
    LinkQuestion: 'Еще нет аккаунта?',
    linkText: 'Зарегистрироваться',
    linkPath: '/yoldi/auth?method=registration',
  },
  authPageUrlPart: 'yoldi/auth',
};

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname.includes(constants.authPageUrlPart);

  const searchParams = useSearchParams();
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_PAGE_STRING;

  const pageData = isRegistrationPage
    ? constants[REGISTRATION_PAGE_STRING]
    : constants[LOGIN_PAGE_STRING];

  if (isAuthPage) {
    return (
      <Container>
        <StyledLink href={pageData.linkPath}>
          <Question>{pageData.LinkQuestion}</Question>
          <Action>{pageData.linkText}</Action>
        </StyledLink>
      </Container>
    );
  }

  return null;
}

const Container = tw.div`
  h-[72px]
  flex flex-row justify-center items-center
  border-[#E6E6E6] border-t
  font-inter
`;

const StyledLink = tw(Link)`
  flex flex-row gap-[4.5px]
  pb-0 xs:pb-[1px]
  pr-[1.5px] xs:pr-0
`;

const Question = tw.div`
  text-[#838383]
`;

const Action = tw.div`
  font-medium
`;

