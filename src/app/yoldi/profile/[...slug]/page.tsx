import { revalidatePath } from 'next/cache';

import { auth, signOut } from '@/lib/auth/next-auth';
import Profile from '@/components/yoldi-profile/profile';
import pg from '@/lib/backend/postgres';
import type { UserWithExtraData, ProfileInfo } from '@/types';
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
  const session = await auth();
  const sessionUser = session?.user as UserWithExtraData;
  const sessionProvider = sessionUser?.iss;
  const sessionUuid = sessionUser?.db_data?.uuid;

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
    dbUser = await pg.getUserByProfileUrl(slug as string);
  }

  if (!dbUser) {
    return (
      <p className="mt-10 mx-auto">
        Пользователь не найден
      </p>
    );
  }

  const dataToPass: any = {
    isAuthenticatedToEdit: sessionUuid === dbUser?.uuid,
    uuid: dbUser.uuid,
    avatar: dbUser.profile_avatar,
    name: dbUser.profile_name,
    profileUrl: dbUser.profile_url_custom || dbUser.profile_url_default,
    cover: dbUser.profile_cover,
    about: dbUser.profile_about || defaultAboutText,
  };

  const provider = sessionProvider || dbUser.default_provider;

  switch (provider) {
    case 'google':
      dataToPass.providerStamp = 'Пользователь Google';
      break;
    case 'github':
      dataToPass.providerStamp = 'Пользователь GitHub';
      break;
    case 'credentials':
      dataToPass.providerStamp = dbUser.credentials_email;
      break;
    default:
      dataToPass.providerStamp = 'N/A';
      break;
  }

  return (
    <Profile data={dataToPass} onSaveData={changeProfileInfo} />
  );
}

