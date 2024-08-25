import { redirect } from 'next/navigation';

import type { SessionWithBaseData, DbUserOrUndef, DataToShowProfile } from '@/types';
import { auth } from '@/lib/auth/next-auth';
import { makeUserProviderStamp } from '@/lib/utils';
import ContentWrapper from '@/components/body-children/content-wrapper';
import Profile from '@/components/yoldi-profile/profile';
import dbQueries from '@/lib/db/queries';
import * as actions from '@/actions';

export const metadata = {
  title: 'Yoldi Profile Page',
};

const defaultAboutText = `
  Рыбатекст используется дизайнерами, проектировщиками и фронтендерами,
  когда нужно быстро заполнить макеты или прототипы содержимым.
  Это тестовый контент, который не должен нести никакого смысла,
  лишь показать наличие самого текста или продемонстрировать типографику в деле.
`.replace(/\s+/g, ' ').trim();

type Props = {
  params: {
    slug: string[];
  };
};

export default async function ProfilePage({ params }: Props) {
  const session = await auth() as SessionWithBaseData;
  const sessionUser = session?.user;
  const sessionUuid = sessionUser?.uuid;

  const slug = params.slug[0];

  // redirect if user is not logged and wants to access "current" user profile
  if (slug === 'me' && !sessionUuid) {
    redirect('/yoldi/auth');
  }

  let dbUser: DbUserOrUndef;

  // db user is same as in session
  if (slug === 'me' && sessionUuid) {
    dbUser = await dbQueries.getUserByUuid(sessionUuid);
  }
  
  // db user is any user except "current", no matter if current session user exist
  if (slug !== 'me') {
    dbUser = await dbQueries.getUserByAlias(slug);
  }

  if (!dbUser) {
    return (
      <ContentWrapper>
        <p className="mt-10 mx-auto">
          Пользователь не найден
        </p>
      </ContentWrapper>
    );
  }

  const dataToPass: DataToShowProfile = {
    isAuthenticatedToEdit: sessionUuid === dbUser.uuid,
    uuid: dbUser.uuid,
    avatar: dbUser.avatar,
    name: dbUser.name,
    alias: dbUser.alias_custom || dbUser.alias_default,
    cover: dbUser.profile_cover,
    about: dbUser.profile_about || defaultAboutText,
    providerStamp: makeUserProviderStamp(dbUser.default_auth_provider, dbUser.auth_email)
  };

  return (
    <ContentWrapper className="relative w-full flex flex-col">
      <Profile data={dataToPass} onSaveData={actions.changeProfileInfo} />
    </ContentWrapper>
  );
}

