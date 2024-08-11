'use client';

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import tw from 'tailwind-styled-components';

import ButtonLarge from '@/components/yoldi/ButtonLarge';

export default function ProfileModal({
  isOpen,
  close
}: {
  isOpen: boolean;
  close: () => void
}) {
  const defaultText = `Рыбатекст используется дизайнерами, проектировщиками и фронтендерами, когда нужно быстро заполнить макеты или прототипы содержимым. Это тестовый контент, который не должен нести никакого смысла, лишь показать наличие самого текста или продемонстрировать типографику в деле.`;

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.body.addEventListener('keydown', closeOnEscapeKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }
  
  const modal = (
    <Modal>
      <EditInfoForm onSubmit={(e) => e.preventDefault()}>

        <FlexContainer>
          <EditInfoTitle>Редактировать профиль</EditInfoTitle>

          <EditInfoLabel>Имя</EditInfoLabel>
          <EditInfoInputField defaultValue="Владислав" />

          <EditInfoLabel>Адрес профиля</EditInfoLabel>
          <ProfileUrlContainer>
            <ProfileUrlLeft>example.com/</ProfileUrlLeft>
            <ProfileUrlRight defaultValue="romanov" />
          </ProfileUrlContainer>
        </FlexContainer>

        <FlexContainer className="flex-grow">
          <EditInfoLabel>Описание</EditInfoLabel>
          <EditInfoTextArea defaultValue={defaultText} />
        </FlexContainer>
        
        <FlexContainer className="flex flex-row gap-[10px]">
          <CancelButton light={true} onClick={close}>Отмена</CancelButton>
          <SaveButton>Сохранить</SaveButton>
        </FlexContainer>

      </EditInfoForm>
    </Modal>
  );

  const modalContainer = document.querySelector('#modal-container') as HTMLElement;
  return ReactDOM.createPortal(modal, modalContainer);
}

const Modal = tw.div`
  z-50 min-h-screen w-full 
  flex flex-col justify-center
  font-inter
  pt-[80px] sm:pt-0
  items-start sm:items-center
  bg-transparent sm:bg-black/30 
`;

const EditInfoForm = tw.form`
  px-[30px] py-[30px]
  flex flex-col
  bg-white

  w-full sm:w-[600px] 
  h-full sm:h-[580px] 
  flex-grow sm:flex-grow-0
  rounded-[0px] md:rounded-[5px]
`;

const FlexContainer = tw.div`
  flex flex-col
`;

const EditInfoTitle = tw.h1`
  mb-[24px]
  font-medium leading-[42px] text-[30px]
`;

const EditInfoLabel = tw.label`
  mb-[4.5px]
  font-medium leading-[26px] text-[#838383]
`;

const EditInfoInputField = tw.input`
  w-full h-[50px] mb-[15.5px] px-[19px] pt-0
  outline-none border rounded-[5px] border-[#D4D4D4]
  placeholder-[#838383] caret-black/70
  focus:border-[#838383]
`;

const ProfileUrlContainer = tw.div`
  relative h-[50px] mb-[16px]
  flex flex-row items-center 
`;

const ProfileUrlLeft = tw.div`
  z-10 absolute h-[50px] px-[19px] py-[12.5px] 
  bg-[#F3F3F3] text-[#838383] 
  border rounded-[5px] rounded-tr-none rounded-br-none border-r-[#D4D4D4]
`;

const ProfileUrlRight = tw(EditInfoInputField)`
  z-20 absolute mb-0 pl-[165px]
  bg-transparent
`;

const EditInfoTextArea = tw.textarea`
  w-full px-[19px] py-3 mb-[25px]
  flex flex-grow 
  outline-none border rounded-[5px] border-[#D4D4D4]
  caret-black/70 leading-[26px]
  focus:border-[#838383]
`;

const CancelButton = tw(ButtonLarge)`
  w-full
`;

const SaveButton = tw(ButtonLarge)`
  w-full
`;

