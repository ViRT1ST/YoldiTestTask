'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import Image from 'next/image';
import Link from 'next/link';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import { AuthConstants } from '@/types';
import { HeaderLogo } from '@/components/yoldi-ui/icons';
import Button from '@/components/yoldi-ui/button';

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

  const userPicture = userData?.avatar || null;
  const userNameFull = userData?.name || 'Anonymous';
  const userNameShort = userNameFull.split(' ')[0];
  const userNameFirstLetter = userNameFull.charAt(0);

  const handleAuthButtonClick = () => {
    router.push(pageData.path);
  };

  const handleUserAvatarClick = () => {
    console.log('handleUserAvatarClick');
  };

  return (
    <div className={twHeaderContainer}>

      <div className={twLogoArea}>
        <div className={twLogoContainer}>
        <Link href="/yoldi">
          <HeaderLogo />
        </Link>
        </div>
        <div className={twTextForLogo}>
          Разрабатываем и запускаем<br />сложные веб проекты
        </div>
      </div>

      <div className={twUserArea}>
        {!isAuthPage && isUserAuthenticated ? (
          <>
            <span className={twUserName}>{userNameShort}</span>
            <button className={twUserAvatarContainer} onClick={handleUserAvatarClick}>
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
                <div className={twUserFirstLetter}>
                  {userNameFirstLetter}
                </div>
              )}
            </button>
          </>
        ) : (
          <Button
            className={'px-8 mt-[1px]'}
            colors="light"
            size="normal"
            onClick={handleAuthButtonClick}
          >
            {pageData.label}
          </Button>
        )}
      </div>

    </div>
  );
}

const twHeaderContainer = twJoin(`
  h-20 px-5
  flex flex-row justify-between
  border-[#E6E6E6] border-b
  font-inter
`);

const twLogoArea = twJoin(`
  relative pt-[12.5px]
  flex flex-row flex-grow 
`);

const twLogoContainer = twJoin(`
  h-[50px] w-20 mr-5 mt-[2.5px]
  bg-[#FEFF80] 
`);

const twTextForLogo = twJoin(`
  absolute left-[100px] pt-[3px]
  text-base leading-[26px]
  hidden sm:block 
`);

const twUserArea = twJoin(`
  flex flex-row items-center 
  pr-[11px] xs:pr-0
`);

const twUserName = twJoin(`
  mt-0.5
  leading-[26px]
`);

const twUserAvatarContainer = twJoin(`
  w-[50px] h-[50px] mt-[1px] ml-5
  flex justify-center items-center
  border-[#E6E6E6] border-[1px] rounded-full
  bg-[#F3F3F3]
  overflow-hidden
`);

const twUserFirstLetter = twJoin(`
  w-fill h-full pl-[1px]
  flex justify-center items-center
  text-[18px] 
`);
