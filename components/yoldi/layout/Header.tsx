'use client';

import { useSearchParams, useRouter  } from 'next/navigation';
import { useSession } from 'next-auth/react';
import tw from 'tailwind-styled-components';
import Image from 'next/image';

import { REGISTRATION_PAGE_STRING, LOGIN_PAGE_STRING } from '@/lib/constants';
import { HeaderLogo } from '@/components/yoldi/ui/Icons';
import ButtonNormal from '@/components/yoldi/ui/ButtonNormal';

export const constants = {
  [REGISTRATION_PAGE_STRING]: {
    authButtonText: 'Войти',
    authButtonPath: '/yoldi/auth?method=login',
  },
  [LOGIN_PAGE_STRING]: {
    authButtonText: 'Зарегистрироваться',
    authButtonPath: '/yoldi/auth?method=registration',
  },
  authPageUrlPart: 'yoldi/auth',
};

export default function Header() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_PAGE_STRING;

  const pageData = isRegistrationPage
    ? constants[REGISTRATION_PAGE_STRING]
    : constants[LOGIN_PAGE_STRING];

  const session = useSession() as any;
  const isUserAuthenticated = Boolean(session?.data?.user);
  const userPicture = session?.data?.user?.profile_avatar;
  const userNameFull = session?.data?.user?.profile_name || 'Anonymous';
  const userNameShort = userNameFull.split(' ')[0];
  const userNameFirstLetter = userNameFull.charAt(0);

  const handleAuthButtonClick = () => {
    router.push(pageData.authButtonPath);
  };

  const handleUserAvatarClick = () => {
    console.log('click');
  };

  return (
    <HeaderContainer>

      <LogoArea>
        <LogoContainer>
          <HeaderLogo />
        </LogoContainer>
        <TextForLogo>
          Разрабатываем и запускаем<br />сложные веб проекты
        </TextForLogo>
      </LogoArea>

      <UserArea>
        {isUserAuthenticated ? (
          <>
            <UserName>{userNameShort}</UserName>
            <UserAvatarContainer onClick={handleUserAvatarClick}>
              {userPicture ? (
                <Image
                  src={userPicture}
                  alt={userNameShort}
                  className="h-full w-full"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority={true}
                /> 
              ) : (
                <UserFirstLetter>{userNameFirstLetter}</UserFirstLetter>
              )}
            </UserAvatarContainer>
          </>
        ) : (
          <ButtonNormal onClick={handleAuthButtonClick} className={'px-8 mt-[1px]'}>
            {pageData.authButtonText}
          </ButtonNormal>
        )}
      </UserArea>

    </HeaderContainer>
  );
}

const HeaderContainer = tw.div`
  h-20 px-5
  flex flex-row justify-between
  border-[#E6E6E6] border-b
  font-inter
`;

const LogoArea = tw.div`
  relative pt-[12.5px]
  flex flex-row flex-grow 
`;

const LogoContainer = tw.div`
  h-[50px] w-20 mr-5 mt-[2.5px]
  bg-[#FEFF80] 
`;

const TextForLogo = tw.div`
  absolute left-[100px] pt-[3px]
  text-base leading-[26px]
  hidden sm:block 
`;

const UserArea = tw.div`
  flex flex-row items-center 
  pr-[11px] xs:pr-0
`;

const UserName = tw.span`
  mt-0.5
  leading-[26px]
`;

const UserAvatarContainer = tw.button`
  w-[50px] h-[50px] mt-[1px] ml-5
  flex justify-center items-center
  border-[#E6E6E6] border-[1px] rounded-full
  bg-[#F3F3F3]
  overflow-hidden
`;

const UserFirstLetter = tw.div`
  w-fill h-full pl-[1px]
  flex justify-center items-center
  text-[18px] 
`;
