'use client';

import tw from 'tailwind-styled-components';

import { useYoldiAuthState } from '@/lib/frontend/store/hooks';

import { HeaderLogo } from '@/components/yoldi/Icons';
import ButtonNormal from '@/components/yoldi/ButtonNormal';

const userName = 'Владислав';
const userFirstLetter = userName.charAt(0);


export default function Header() {
  const { isUserAuthenticated, setIsUserAuthenticated } = useYoldiAuthState();

  const handleButtonClick = () => {
    console.log(isUserAuthenticated);
    setIsUserAuthenticated(!isUserAuthenticated);
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
            <UserName>{userName}</UserName>
            <UserPicture>{userFirstLetter}</UserPicture>
          </>
        ) : (
          <ButtonNormal onClick={handleButtonClick} className={'px-8 mt-[1px]'}>
            Войти
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
  absolute left-[100px]
  leading-[26px]
  hidden xs:block 
  text-sm sm:text-base
  pt-2 sm:pt-1
`;

const UserArea = tw.div`
  flex flex-row items-center 
  pr-[11px] xs:pr-0
`;

const UserName = tw.span`
  mt-0.5
  leading-[26px]
`;

const UserPicture = tw.div`
  mt-[1px]
  w-[50px] h-[50px] ml-5 pt-[1px]
  flex justify-center items-center
  border-[#E6E6E6] border-[1px] rounded-full
  bg-[#F3F3F3]
  text-[18px]
`;
