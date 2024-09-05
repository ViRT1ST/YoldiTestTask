'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import type { AuthConstants, SessionMainFields } from '@/types';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/config/public';
import { classesBeautify } from '@/utils/styles';
import { HeaderLogo } from '@/components/[common-ui]/icons';
import Button from '@/components/[common-ui]/button';
import Avatar from '@/components/[common-ui]/avatar';
import * as actions from '@/actions';

type Props = {
  userData: SessionMainFields | null;
  authConstants: AuthConstants;
};

export default function Header({ userData, authConstants }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isDebugPage = pathname.includes('/page/debug');
  const isAuthPage = pathname === authConstants.authPagePath;
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_STRING;
  
  const pageData = isRegistrationPage
    ? authConstants[LOGIN_STRING]
    : authConstants[REGISTRATION_STRING];

  const isUserAuthenticated = Boolean(userData);

  const userPicture = userData?.avatar || null;
  const userNameFull = userData?.name || 'Anonymous';
  const userNameShort = userNameFull.split(' ')[0];

  const [ isAvatarMenuOpen, setIsAvatarMenuOpen ] = useState(false);

  const handleAvatarMenuClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const handleAuthButton = () => {
    setIsAvatarMenuOpen(false);
    router.push(pageData.path);
  };

  const handleAvatarMenuLogout = () => {
    setIsAvatarMenuOpen(false);
    actions.signOutWithRedirectToAuthPage();
  };

  const handleAvatarMenuGoToProfile = () => {
    setIsAvatarMenuOpen(false);
    router.push('/page/profile/me');
  };


  if (isDebugPage) {
    return null;
  }

  return (
    <div className={twHeaderContainer}>

      <div className={twLogoArea}>
        <div className={twLogoContainer}>
        <Link href="/page/accounts">
          <HeaderLogo />
        </Link>
        </div>
        <div className={twTextForLogo}>
          Разрабатываем и запускаем<br />сложные веб проекты
        </div>
      </div>

      <div className={twUserArea}>
        {/* Show user avatar or auth button */}
        {!isAuthPage && isUserAuthenticated ? (
          <>
            <span className={twUserName}>{userNameShort}</span>
            
            <button className={twUserAvatarContainer} onClick={handleAvatarMenuClick}>
              <Avatar url={userPicture} name={userNameFull} showBorder={true} />
            </button>

            {isAvatarMenuOpen && (
              <div className={twAvatarMenu}>
                <Button
                  colors="light"
                  size="normal"
                  onClick={handleAvatarMenuGoToProfile}
                >
                  Профиль
                </Button>
                <Button
                  colors="light"
                  size="normal"
                  onClick={handleAvatarMenuLogout}
                >
                  Выйти
                </Button>
              </div>
            )}
          </>
        ) : (
          <Button
            className={'px-8 mt-[1px]'}
            colors="light"
            size="normal"
            onClick={handleAuthButton}
          >
            {pageData.label}
          </Button>
        )}
      </div>

    </div>
  );
}

const twHeaderContainer = classesBeautify(`
  h-20 px-5 flex flex-row justify-between
  border-[#E6E6E6] border-b
  font-inter
`);

const twLogoArea = classesBeautify(`
  relative pt-[12.5px] flex flex-row flex-grow 
`);

const twLogoContainer = classesBeautify(`
  h-[50px] w-20 mr-5 mt-[2.5px]
  bg-[#FEFF80] 
`);

const twTextForLogo = classesBeautify(`
  absolute left-[100px] pt-[3px]
  text-base leading-[26px]
  hidden sm:block 
`);

const twUserArea = classesBeautify(`
  relative flex flex-row justify-center items-center
  pr-[11px] xs:pr-0
`);

const twUserName = classesBeautify(`
  mt-0.5
  leading-[26px]
`);

const twUserAvatarContainer = classesBeautify(`
  w-[50px] h-[50px] mt-[1px] ml-5
`);

const twAvatarMenu = classesBeautify(`
  z-50 absolute top-[70px] right-0 px-2 py-4
  flex flex-col gap-2 
  bg-gray-100 border rounded-[5px] border-[#E6E6E6]
`);