import { twJoin } from 'tailwind-merge';

import { auth } from '@/lib/auth/next-auth';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import type { SessionWithExtraData } from '@/types';
import Header from '@/components/yoldi-ui/header';
import Footer from '@/components/yoldi-ui/footer';

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
  const session = await auth() as SessionWithExtraData;
  const sessionUser = session?.user;

  return (
    <div className={twContainer}>
      <Header authConstants={authConstants} userData={sessionUser || null} />

      <main className={twMain}>
        {children}
      </main>

      <Footer authConstants={authConstants} />
    </div>
  );
}

const twContainer = twJoin(`
  w-full h-full min-h-screen
  flex flex-col
  font-inter
`);

const twMain = twJoin(`
  flex-grow flex 
  bg-[#F3F3F3]
  bg-transparent xs:bg-[#F3F3F3]
`);
