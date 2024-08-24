'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';

import {
  EditIcon,
  LogoutIcon,
  UploadUpIcon,
  UploadImageIcon,
  UploadTrashIcon,
  PhotoIcon,
  LoadingIcon
} from '@/components/yoldi-ui/icons';
import Button from '@/components/yoldi-ui/button';
import Avatar from '@/components/yoldi-ui/avatar';
import ProfileModal from '@/components/yoldi-profile/profile-modal';
import ContentLimiter from '@/components/body-children/content-limiter';
import { classesBeautify } from '@/lib/utils';
import * as actions from '@/actions';

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

  const { isAuthenticatedToEdit, providerStamp, name, avatar, cover, about } = data;
  const nameFirstLetter = name.charAt(0) as string;
  const isCoverExist = !!cover;

  const [errorMsg, setErrorMsg] = useState(searchParams.get('error') || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverChangeInProcess, setIsCoverChangeInProcess] = useState(false);
  const [isAvatarChangeInProcess, setIsAvatarChangeInProcess] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const changeCoverButtonData = isCoverExist
    ? changeCoverData.remove
    : changeCoverData.upload;

  useEffect(() => {
    if (errorMsg) {
      // hide url params after error
      router.push('/yoldi/profile/me'); 
      toast.error(errorMsg);
    }

    setTimeout(() => setErrorMsg(null), 10000);
  }, [errorMsg]);

  const coverChangeHandler = () => {
    if (isCoverExist) {
      // server action to remove cover
      setIsCoverChangeInProcess(true);
      actions.deleteProfileCover();
    } else {
      coverFileInputRef.current?.click();
    }
  };

  const coverInputFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    // server action to upload image and update cover
    if (image) {
      setIsCoverChangeInProcess(true);
      const formData = new FormData();
      formData.append('file', image);
      actions.changeProfileCover(formData);
    }
  };

  const avatarChangeHandler = () => {
    avatarFileInputRef.current?.click();
  };

  const avatarInputFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    // server action to upload image and update cover
    if (image) {
      setIsAvatarChangeInProcess(true);
      const formData = new FormData();
      formData.append('file', image);
      actions.changeProfileAvatar(formData);
    }
  };

  return (
    <>
      <ProfileModal
        isOpen={isModalOpen}
        data={data}
        onSaveData={onSaveData}
        close={() => setIsModalOpen(false)}
      />

      <div className={twCoverContainer} style={cover && { backgroundImage: `url(${cover})` }}>
        {isAuthenticatedToEdit && (
          <>
            <input
              ref={coverFileInputRef}
              className="hidden"
              onChange={(e) => coverInputFileHandler(e)}
              type="file"
              accept="image/png, image/jpeg"
              name="file"
            />

            {isCoverChangeInProcess ? (
              <Button
                title=""
                colors="light"
                size="normal"
                disabled
              >
                {'Изменение обложки...'}
              </Button>
            ) : (
              <Button
                className="pl-[26px] bg-white opacity-0 group-hover:opacity-100"
                title=""
                colors="light"
                size="normal"
                onClick={coverChangeHandler}
              >
                <span className={twMerge(twSvgContainer, 'w-5 px-0 pl-0')}>
                  {changeCoverButtonData.actionIcon}
                </span>
                <span>
                  {
                    isCoverChangeInProcess && 'Изменение...' ||
                    changeCoverButtonData.buttonText
                  }
                </span>
                <span className={twMerge(twSvgContainer, 'w-[26px] pt-[3px]')}>
                  <UploadImageIcon />
                </span>
              </Button>
            )}
          </>
        )}
      </div>

      <ContentLimiter className="relative py-[85px]">

        <div className={twUserAvatarContainer}>
          {isAvatarChangeInProcess ? (
            <span className={twUserAvatarLoadingIcon}>
              <LoadingIcon />
            </span>
          ) : (
            <Avatar
              url={avatar}
              name={name}
              className="w-[100px] h-[100px] text-[36px]"
              showBorder={false}
            />
          )}

          {isAuthenticatedToEdit && (
            <>
              <input
                ref={avatarFileInputRef}
                className="hidden"
                onChange={(e) => avatarInputFileHandler(e)}
                type="file"
                accept="image/png, image/jpeg"
                name="file"
              />

              <button
                className={twUserAvatarPhotoIconButton}
                onClick={avatarChangeHandler}
              >
                <span className={'w-full h-full flex justify-center items-center'}>
                  <PhotoIcon />
                </span>
              </button>
            </>
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
              onClick={() => actions.signOutWithRedirectToAuthPage()}
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

      </ContentLimiter>
    </>
  );
}

const twCoverContainer = classesBeautify(`
  h-[200px] flex justify-center items-center
  bg-[#F3F3F3] border-b border-[#E6E6E6] 
  group bg-cover bg-no-repeat bg-center 
`);

const twAside = classesBeautify(`
  h-[200px]
`);

const twContent = classesBeautify(`
  flex-grow
`);

const twSvgContainer = classesBeautify(`
  w-[25px] h-[25px] px-[2px] py-[2px]
`);

const twUserAvatarContainer = classesBeautify(`
  absolute w-[100px] h-[100px] -top-[50px] left-[29px] flex justify-center 
  rounded-full border border-[#E6E6E6] bg-[#F3F3F3]
  overflow-hidden group 
`);

const twUserAvatarPhotoIconButton = classesBeautify(`
  absolute w-[100px] h-[100px] top-0 right-0 z-10
  bg-black
  opacity-0 group-hover:opacity-100
`);

const twUserAvatarLoadingIcon = classesBeautify(`
  absolute w-[100px] h-[100px] top-0 right-0 z-20
  animate-spin
`);

const twUserName = classesBeautify(`
  mb-[11.5px]
  text-[30px] font-medium leading-[42px]
`);

const twUserProviderStamp = classesBeautify(`
  block text-[#838383]
`);

const twUserAbout = classesBeautify(`
  mt-[30.5px]
  leading-[26px]
`);

const twErrorContainer = classesBeautify(`
  w-full px-2 py-2 my-6 flex flex-col justify-center
  text-black bg-red-50 rounded-[5px]
`);

