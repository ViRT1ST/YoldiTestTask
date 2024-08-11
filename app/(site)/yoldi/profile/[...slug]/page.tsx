import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth/next-auth';
import Profile from '@/components/yoldi/profile/Profile';
import pg from '@/lib/backend/postgres';

export const metadata = {
  title: 'Yoldi Profile Page',
};

const defaultAboutText = `
  Рыбатекст используется дизайнерами, проектировщиками и фронтендерами,
  когда нужно быстро заполнить макеты или прототипы содержимым.
  Это тестовый контент, который не должен нести никакого смысла,
  лишь показать наличие самого текста или продемонстрировать типографику в деле.
`.replace(/\s+/g, ' ').trim();

const userNotFoundContent = (
  <p className="mt-10 mx-auto">
    Пользователь не найден
  </p>
);

export default async function ProfilePage(context: any) {
  const session = await auth() as any;
  const sessionUser = session?.user;
  
  const slug = context?.params?.slug?.[0];

  const userByUuid = await pg.getUserByUuid(sessionUser?.uuid) as any;
  const userBySlug = await pg.getUserByProfileUrl(slug) as any;

  if (slug !== 'me' && !userBySlug) {
    return userNotFoundContent;
  }

  const dbUser = userBySlug || userByUuid || null;

  if (!dbUser) {
    return userNotFoundContent;
  }

  const isAuthenticated = dbUser?.uuid === sessionUser?.uuid;

  const userData: any = {
    isAuthenticated,
    uuid: dbUser.uuid,
    providerStamp: 'N/A',
  };

  const sessionData = isAuthenticated && sessionUser || null;

  const provider = sessionData && sessionData?.provider || dbUser.default_provider;
  switch (provider) {
    case 'google':
      userData.providerStamp = 'Пользователь Google';
      break;
    case 'github':
      userData.providerStamp = 'Пользователь GitHub';
      break;
    case 'credentials':
      userData.providerStamp = dbUser.credentials_email;
      break;
  }

  userData.avatar = sessionData?.profile_avatar || dbUser.profile_avatar;
  userData.name = sessionData?.profile_name || dbUser.profile_name;
  userData.profileUrl = dbUser.profile_url_custom || dbUser.profile_url_default;
  userData.cover = dbUser.profile_cover;
  userData.about = dbUser.profile_about || defaultAboutText;

  const saveData = async (data: any) => {
    'use server';

    const { name, about, idForUrl } = data;

    const dataForSave: any = {
      uuid: sessionUser?.uuid,
    };

    if (name !== userData.name && name.trim().length > 2) {
      dataForSave.name = name;
    }

    if (about !== defaultAboutText && about.trim().length > 0) {
      dataForSave.about = about;
    }

    if (
      !idForUrl.startsWith('id') &&
      idForUrl !== userData.profileUrl &&
      idForUrl.length > 2 &&
      idForUrl.match(/^[a-zA-Z0-9_]+$/)
    ) {
      dataForSave.idForUrl = idForUrl;
    }
  
    await pg.updateProfile(dataForSave);
    revalidatePath('/yoldi/profile');
  };

  return (
    <Profile data={userData} onSaveData={saveData} />
  );
}

