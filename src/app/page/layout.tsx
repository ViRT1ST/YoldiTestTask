import { REGISTRATION_STRING, LOGIN_STRING } from '@/config/public';
import type { SessionWithBaseData } from '@/types';
import { auth } from '@/lib/next-auth';
import Header from '@/components/[common-ui]/header';
import Footer from '@/components/[common-ui]/footer';

export const authConstants = {
  [LOGIN_STRING]: {
    question: 'Уже есть аккаунт?',
    label: 'Войти',
    path: '/page/auth?method=login'
  },
  [REGISTRATION_STRING]: {
    question: 'Уже есть аккаунт?',
    label: 'Зарегистрироваться',
    path: '/page/auth?method=registration'
  },
  authPagePath: '/page/auth',
};

type Props = {
  children: React.ReactNode;
};

export default async function YoldiLayout({ children }: Props) {
  const session = await auth() as SessionWithBaseData;
  const sessionUser = session?.user;

  return (
    <div className="w-full h-full min-h-screen flex flex-col font-inter">
      <Header authConstants={authConstants} userData={sessionUser || null} />
        {children}
      <Footer authConstants={authConstants} />
    </div>
  );
}