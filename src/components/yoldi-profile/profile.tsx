'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signOutWithRedirectToAuthPage } from '@/actions';
import { toast } from 'react-toastify';
import { twMerge, twJoin } from 'tailwind-merge';
import Image from 'next/image';

import {
  EditIcon,
  LogoutIcon,
  UploadUpIcon,
  UploadImageIcon,
  UploadTrashIcon
} from '@/components/yoldi-ui/icons';
import Button from '@/components/yoldi-ui/button';
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState(searchParams.get('error') || null);

  const { isAuthenticatedToEdit, providerStamp, name, avatar, cover, about } = data;
  const nameFirstLetter = name.charAt(0) as string;

  const [isCoverExist, setIsCoverExist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const changeCoverButtonData = isCoverExist
    ? changeCoverData.remove
    : changeCoverData.upload;

  useEffect(() => {
    if (errorMsg) {
      router.push('/yoldi/profile/me');
      toast.error(errorMsg);
    }

    setTimeout(() => setErrorMsg(null), 10000);
  }, [errorMsg]);

  const inputFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasFile = Boolean(e.target.files?.length);
    // upload image
    setIsCoverExist(!isCoverExist);
  };

  const coverEditHandler = () => {
    hiddenFileInputRef.current?.click();
  };

  return (
    <div className={twPageContainer}>
      <ProfileModal
        isOpen={isModalOpen}
        data={data}
        onSaveData={onSaveData}
        close={() => setIsModalOpen(false)}
      />

      <div className={twCoverContainer}>
        {isAuthenticatedToEdit && (
          <>
            <input
              ref={hiddenFileInputRef}
              className="hidden"
              onChange={(e) => inputFileChangeHandler(e)}
              type="file"
              accept="image/png, image/jpeg"
            />

            <Button
              className="pl-[26px] bg-white opacity-100 group-hover:opacity-100"
              title={''}
              colors="light"
              size="normal"
              onClick={coverEditHandler}
            >
              <span className={twMerge(twSvgContainer, 'w-5 px-0 pl-0')}>
                {changeCoverButtonData.actionIcon}
              </span>
              <span>
                {changeCoverButtonData.buttonText}
              </span>
              <span className={twMerge(twSvgContainer, 'w-[26px] pt-[3px]')}>
                <UploadImageIcon />
              </span>
            </Button>
          </>
        )}
      </div>

      <div className={twInfoContainer}>
        <div className={twInfoLimiter}>

          <div className={twUserAvatarContainer}>
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
              <div className={twNameFirstLetter}>
                {nameFirstLetter}
              </div>
            )}
          </div>

          <section className={twContent}>
  
            <h1 className={twUserName}>{name}</h1>
            <span className={twUserProviderStamp}>{providerStamp}</span>

            {isAuthenticatedToEdit && (
              <Button
                className="mt-[10.5px] flex md:hidden"
                colors="light"
                size="normal"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <span className={twSvgContainer}>
                  <EditIcon />
                </span>
                <span>Редактировать</span>
              </Button>
            )}

            <p className={twUserAbout}>
              {about}
            </p>

            {errorMsg && (
              <div className={twErrorContainer}>
                <p className="text-red-600">Error</p>
                <ul >
                  {errorMsg.split(' | ').map((error) => (
                    <li key={error}>* {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {isAuthenticatedToEdit && (
              <Button
                className="mt-[59.5px]"
                colors="light"
                size="normal"
                onClick={() => signOutWithRedirectToAuthPage()}
              >
                <span className={twSvgContainer}>
                  <LogoutIcon />
                </span>
                <span>Выйти</span>
              </Button>
            )}
          </section>

          <aside className={twAside}>
            {isAuthenticatedToEdit && (
              <Button
                className="hidden md:flex"
                colors="light"
                size="normal"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <span className={twSvgContainer}>
                  <EditIcon />
                </span>
                <span>Редактировать</span>
              </Button>
            )}  
          </aside>

        </div>
      </div>

    </div>
  );
}

const twPageContainer = twJoin(`
  relative w-full
  flex flex-col 
`);

const twCoverContainer = twJoin(`
  h-[200px]
  flex justify-center items-center
  bg-[#F3F3F3] border-b border-[#E6E6E6] 
  group
`);

const twInfoContainer = twJoin(`
  px-[30px]
  flex flex-grow 
  bg-white
`);

const twInfoLimiter = twJoin(`
  relative w-[800px] min-w-[280px] mx-auto py-[85px]
  flex flex-row
`);

const twAside = twJoin(`
  h-[200px]
`);

const twContent = twJoin(`
  flex-grow
`);

const twSvgContainer = twJoin(`
  w-[25px] h-[25px] px-[2px] py-[2px]
`);

const twUserAvatarContainer = twJoin(`
  absolute w-[100px] h-[100px] -top-[50px] left-0
  flex justify-center 
  rounded-full border border-[#E6E6E6] bg-[#F3F3F3]
  overflow-hidden 
`);

const twNameFirstLetter = twJoin(`
  pt-[22px] mx-auto
  text-[36px]
`);

const twUserName = twJoin(`
  mb-[11.5px]
  text-[30px] font-medium leading-[42px]
`);

const twUserProviderStamp = twJoin(`
  block text-[#838383]
`);

const twUserAbout = twJoin(`
  mt-[30.5px]
  leading-[26px]
`);

const twErrorContainer = twJoin(`
  w-full px-2 py-2 my-6 flex flex-col justify-center
  text-black bg-red-50 rounded-[5px]
`);

