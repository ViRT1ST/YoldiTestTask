'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import tw from 'tailwind-styled-components';
import Image from 'next/image';

import {
  EditIcon,
  LogoutIcon,
  UploadUpIcon,
  UploadImageIcon,
  UploadTrashIcon
} from '@/components/yoldi-common/icons';
import ButtonNormal from '@/components/yoldi-common/button-normal';
import ProfileModal from '@/components/yoldi-profile/profile-modal';

const changeCoverData = {
  upload: {
    buttonText: 'Загрузить',
    buttonToolTip: 'Загрузить обложку профиля',
    actionIcon: <UploadUpIcon  />
  },
  remove: {
    buttonText: 'Удалить',
    buttonToolTip: 'Удалить обложку профиля',
    actionIcon: <UploadTrashIcon  />
  }
};

interface ProfileProps {
  data: any;
  onSaveData: (data: any) => void
}

export default function Profile({ data, onSaveData }: ProfileProps) {
  const router = useRouter();

  const { isAuthenticated, providerStamp, name, avatar, cover, about } = data;
  console.log(data);

  const nameFirstLetter = name.charAt(0) as string;

  const [isCoverExist, setIsCoverExist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const changeCoverButtonData = isCoverExist
    ? changeCoverData.remove
    : changeCoverData.upload;

  // useEffect(() => {
    
  //   console.log('refreshed');
  // }, [name, avatar, idForUrl, cover, about]);

  const inputFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasFile = Boolean(e.target.files?.length);
    // upload image
    setIsCoverExist(!isCoverExist);
  };

  const coverEditHandler = () => {
    hiddenFileInputRef.current?.click();
  };

  return (
    <PageContainer>
      <ProfileModal
        isOpen={isModalOpen}
        data={data}
        onSaveData={onSaveData}
        close={() => setIsModalOpen(false)}
      />

      <CoverContainer>

      {isAuthenticated && (
        <>
          <input
            ref={hiddenFileInputRef}
            className="hidden"
            onChange={(e) => inputFileChangeHandler(e)}
            type="file"
            accept="image/png, image/jpeg"
          />

          <CoverEditButton
            onClick={coverEditHandler}
            title={''}
          >
            <SvgContainer className="w-5 px-0 pl-0">
              {changeCoverButtonData.actionIcon}
            </SvgContainer>
            <span>{changeCoverButtonData.buttonText}</span>
            <SvgContainer className="w-[26px] pt-[3px]">
              <UploadImageIcon />
            </SvgContainer>
          </CoverEditButton>
        </>
      )}

      </CoverContainer>

      <InfoContainer>
        <InfoLimiter>

          <UserAvatarContainer>
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              className="h-full w-full"
              width={0}
              height={0}
              sizes="100vw"
              priority={true}
            /> 
          ) : (
            <NameOneLetter>{nameFirstLetter}</NameOneLetter>
          )}
          </UserAvatarContainer>

          <Content>
  
            <UserName>{name}</UserName>
            <UserProviderStamp>{providerStamp}</UserProviderStamp>

            {isAuthenticated && (
              <EditButtonInContent onClick={() => setIsModalOpen(!isModalOpen)}>
              <SvgContainer><EditIcon /></SvgContainer>
              <span>Редактировать</span>
              </EditButtonInContent>
            )}

            <UserAbout>
              {about}
            </UserAbout>

            {isAuthenticated && (
              <LogoutButton onClick={() => signOut()}>
                <SvgContainer>
                  <LogoutIcon />
                </SvgContainer>
                <span>Выйти</span>
              </LogoutButton>
            )}
          </Content>

          <Aside>
          {isAuthenticated && (
            <EditButtonInAside onClick={() => setIsModalOpen(!isModalOpen)}>
              <SvgContainer>
                <EditIcon />
              </SvgContainer>
              <span>Редактировать</span>
            </EditButtonInAside>
          )}  
          </Aside>

        </InfoLimiter>
      </InfoContainer>

    </PageContainer>
  );
}

const PageContainer = tw.div`
  relative w-full
  flex flex-col 
`;

const CoverContainer = tw.div`
  h-[200px]
  flex justify-center items-center
  bg-[#F3F3F3] border-b border-[#E6E6E6] 
  group
`;

const CoverEditButton = tw(ButtonNormal)`
  pl-[26px]
  bg-white opacity-100 group-hover:opacity-100
`;

const InfoContainer = tw.div`
  px-[30px]
  flex flex-grow 
  bg-white
`;

const InfoLimiter = tw.div`
  relative w-[800px] min-w-[280px] mx-auto py-[85px]
  flex flex-row
`;

const Aside = tw.aside`
  h-[200px]
`;

const Content = tw.section`
  flex-grow
`;

const SvgContainer = tw.span`
  w-[25px] h-[25px] px-[2px] py-[2px]
`;

const UserAvatarContainer = tw.div`
  absolute w-[100px] h-[100px] -top-[50px] left-0
  flex justify-center 
  rounded-full border border-[#E6E6E6] bg-[#F3F3F3]
  overflow-hidden 
`;

const NameOneLetter = tw.div`
  pt-[22px] mx-auto
  text-[36px]
`;

const UserName = tw.h1`
  mb-[11.5px]
  text-[30px] font-medium leading-[42px]
`;

const EditButtonInContent = tw(ButtonNormal)`
  mt-[10.5px]
  flex md:hidden
`;

const EditButtonInAside = tw(ButtonNormal)`
  hidden md:flex
`;

const UserProviderStamp = tw.p`
  text-[#838383]
`;

const UserAbout = tw.p`
  mt-[30.5px]
  leading-[26px]
`;

const LogoutButton = tw(ButtonNormal)`
  mt-[59.5px]
`;


