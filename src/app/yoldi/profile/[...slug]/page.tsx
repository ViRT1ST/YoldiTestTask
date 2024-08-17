import { auth } from '@/lib/auth/next-auth';
import Profile from '@/components/yoldi-profile/profile';
import pg from '@/lib/db/postgres';
import type { SessionWithExtraData, ProfileInfo } from '@/types';
import { redirect } from 'next/navigation';
import { changeProfileInfo } from '@/actions';

export const metadata = {
  title: 'Yoldi Profile Page',
};

const defaultAboutText = `
  Рыбатекст используется дизайнерами, проектировщиками и фронтендерами,
  когда нужно быстро заполнить макеты или прототипы содержимым.
  Это тестовый контент, который не должен нести никакого смысла,
  лишь показать наличие самого текста или продемонстрировать типографику в деле.
`.replace(/\s+/g, ' ').trim();

export default async function ProfilePage(context: any) {
  const session = await auth() as SessionWithExtraData;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;

  const slug = context?.params?.slug?.[0];

  let dbUser: any = null;

  // redirect if user is not logged and wants to access "current" user profile
  if (slug === 'me' && !sessionUuid) {
    redirect('/yoldi/auth');
  }

  // db user is same as in session
  if (slug === 'me' && sessionUuid) {
    dbUser = await pg.getUserByUuid(sessionUuid as string);
  }
  
  // db user is any user except "current", no matter if current session user exist
  if (slug !== 'me') {
    dbUser = await pg.getUserByAlias(slug as string);
  }

  if (!dbUser) {
    return (
      <p className="mt-10 mx-auto">
        Пользователь не найден
      </p>
    );
  }

  const makeProviderStamp = (provider: string, authEmail: string) => {
    let providerStamp = '';

    switch (provider) {
      case 'google':
        providerStamp = 'Пользователь Google';
        break;
      case 'github':
        providerStamp = 'Пользователь GitHub';
        break;
      case 'credentials':
        providerStamp = authEmail || '';
        break;
    }

    return providerStamp;
  };

  const dataToPass: any = {
    isAuthenticatedToEdit: sessionUuid === dbUser.uuid,
    uuid: dbUser.uuid,
    avatar: dbUser.avatar,
    name: dbUser.name,
    alias: dbUser.alias_custom || dbUser.alias_default,
    cover: dbUser.profile_cover,
    about: dbUser.profile_about || defaultAboutText,
    providerStamp: makeProviderStamp(dbUser.default_auth_provider, dbUser.auth_email)
  };

  return (
    <Profile data={dataToPass} onSaveData={changeProfileInfo} />
  );
}

