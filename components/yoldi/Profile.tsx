'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import tw from 'tailwind-styled-components';

import {
  EditIcon,
  LogoutIcon,
  UploadUpIcon,
  UploadImageIcon,
  UploadTrashIcon
} from '@/components/yoldi/Icons';
import ButtonNormal from '@/components/yoldi/ButtonNormal';
import ProfileModal from '@/components/yoldi/ProfileModal';

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

export default function Profile() {
  const session = useSession();
  console.log('data', session?.data);

  const [isCoverExist, setIsCoverExist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const changeCoverButtonData = isCoverExist
    ? changeCoverData.remove
    : changeCoverData.upload;

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
      <ProfileModal isOpen={isModalOpen} close={() => setIsModalOpen(false)}/>

      <CoverContainer>
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

      </CoverContainer>

      <InfoContainer>
        <InfoLimiter>
          <UserAvatar>B</UserAvatar>

          <Content>
  
            <UserName>Владислав</UserName>
            <UserEmail>example@gmail.com</UserEmail>

            <EditButtonInContent onClick={() => setIsModalOpen(!isModalOpen)}>
              <SvgContainer><EditIcon /></SvgContainer>
              <span>Редактировать</span>
            </EditButtonInContent>

            <UserAbout>
              Рыбатекст используется дизайнерами, проектировщиками и фронтендерами,
              когда нужно быстро заполнить макеты или прототипы содержимым.
              Это тестовый контент, который не должен нести никакого смысла,
              лишь показать наличие самого текста или продемонстрировать типографику в деле.
            </UserAbout>

            <LogoutButton>
              <SvgContainer>
                <LogoutIcon />
              </SvgContainer>
              <span>Выйти</span>
            </LogoutButton>
          </Content>

          <Aside>
            <EditButtonInAside onClick={() => setIsModalOpen(!isModalOpen)}>
              <SvgContainer>
                <EditIcon />
              </SvgContainer>
              <span>Редактировать</span>
            </EditButtonInAside>
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

const UserAvatar = tw.span`
  absolute w-[100px] h-[100px] -top-[50px] left-0 pt-[22px]
  flex justify-center 
  text-[36px] rounded-full border border-[#E6E6E6] bg-[#F3F3F3] 
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

const UserEmail = tw.p`
  text-[#838383]
`;

const UserAbout = tw.p`
  mt-[30.5px]
  leading-[26px]
`;

const LogoutButton = tw(ButtonNormal)`
  mt-[59.5px]
`;


