import type { SessionWithBaseData } from '@/types';
import { auth } from '@/lib/auth/next-auth';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants/public';
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
  authPagePath: '/yoldi/auth',
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