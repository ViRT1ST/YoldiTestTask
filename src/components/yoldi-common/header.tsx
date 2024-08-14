'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import tw from 'tailwind-styled-components';
import Image from 'next/image';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import { AuthConstants } from '@/types';
import { HeaderLogo } from '@/components/yoldi-common/icons';
import ButtonNormal from '@/components/yoldi-common/button-normal';

interface HeaderProps {
  userData: {
    [key: string]: any;
  } | null;
  authConstants: AuthConstants;
}

export default function Header({ userData, authConstants }: HeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isRegistrationPage = searchParams.get('method') === REGISTRATION_STRING;
  const isAuthPage = pathname.includes(authConstants.authPageUrlPart);

  const pageData = isRegistrationPage
    ? authConstants[LOGIN_STRING]
    : authConstants[REGISTRATION_STRING];

  const isUserAuthenticated = Boolean(userData);

  const userPicture = userData?.profile_avatar || null;
  const userNameFull = userData?.profile_name || 'Anonymous';
  const userNameShort = userNameFull.split(' ')[0];
  const userNameFirstLetter = userNameFull.charAt(0);

  const handleAuthButtonClick = () => {
    router.push(pageData.path);
  };

  const handleUserAvatarClick = () => {
    console.log('handleUserAvatarClick');
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
        {!isAuthPage && isUserAuthenticated ? (
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
          <ButtonNormal className={'px-8 mt-[1px]'} onClick={handleAuthButtonClick}>
            {pageData.label}
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
