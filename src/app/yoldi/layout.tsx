import tw from 'tailwind-styled-components';

import Header from '@/components/yoldi-common/header';
import Footer from '@/components/yoldi-common/footer';
import { auth } from '@/lib/auth/next-auth';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import type { UserWithExtraData } from '@/types';

export const authConstants = {
  [LOGIN_STRING]: {
    question: 'Уже есть аккаунт?',
    label: 'Войти',
    path: '/yoldi/auth?method=login'
  },
  [REGISTRATION_STRING]: {
    question: 'Уже есть аккаунт?',
    label: 'Зарегистрироваться',
    path: '/yoldi/auth?method=registration'
  },
  authPageUrlPart: 'yoldi/auth',
};

interface YoldiLayoutProps {
  children: React.ReactNode;
}

export default async function YoldiLayout({ children }: YoldiLayoutProps) {
  const session = await auth();
  const sessionUser = session?.user as UserWithExtraData;

  let userData: any = null;

  if (sessionUser?.db_data) {
    userData = sessionUser.db_data;
  }

  return (
    <Container>
      <Header authConstants={authConstants} userData={userData} />

      <Main>
        {children}
      </Main>

      <Footer authConstants={authConstants} />
    </Container>
  );
}

const Container = tw.div`
  w-full h-full min-h-screen
  flex flex-col
  font-inter
`;

const Main = tw.div`
  flex-grow flex 
  bg-[#F3F3F3]
  bg-transparent xs:bg-[#F3F3F3]
`;
