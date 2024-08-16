'use client';

import { twMerge, twJoin } from 'tailwind-merge';
import { useState,useEffect } from 'react';
import ReactDOM from 'react-dom';

import Button from '@/components/yoldi-ui/button';

interface ProfileModalProps {
  isOpen: boolean;
  data: any;
  onSaveData: (data: any) => void;
  close: () => void;
}

export default function ProfileModal({ isOpen, data, onSaveData, close }: ProfileModalProps) {
  const { name, profileUrl, about } = data;

  const [nameText, setNameText] = useState(name);
  const [idForUrlText, setIdForUrlText] = useState(profileUrl);
  const [aboutText, setAboutText] = useState(about);

  useEffect(() => {
    const closeOnEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.body.addEventListener('keydown', closeOnEscKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscKey);
    };
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    close();
    onSaveData({
      name: nameText,
      idForUrl: idForUrlText,
      about: aboutText
    });
    // window.location.reload();
  };
  
  const modal = (
    <div className={twModal}>
      <form className={twForm} onSubmit={handleFormSubmit}>

        <div className={twFlexContainer}>
          <h1 className={twTitle}>Редактировать профиль</h1>

          <label className={twLabel}>Имя</label>
          <input
            className={twInput}
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
          />

          <label className={twLabel}>Адрес профиля</label>
          <div className={twUrlContainer}>
            <div className={twUrlLeft}>example.com/</div>
            <input
              className={twMerge(twInput, 'z-20 absolute mb-0 pl-[165px] bg-transparent')}  
              value={idForUrlText}
              onChange={(e) => setIdForUrlText(e.target.value)}
            />
          </div>
        </div>

        <div className={twMerge(twFlexContainer, 'flex-grow')}>
          <label className={twLabel}>Описание</label>
          <textarea
            className={twTextArea}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
          />
        </div>
        
        <div className={twMerge(twFlexContainer, 'flex-row gap-[10px]')}>
          <Button className="w-full" colors="light" size="big" onClick={close}>
            Отмена
          </Button>
          <Button className="w-full" colors="dark" size="big" type="submit">
            Сохранить
          </Button>
        </div>

      </form>
    </div>
  );

  const modalContainer = document.querySelector('#modal-container') as HTMLElement;
  return ReactDOM.createPortal(modal, modalContainer);
}

const twModal = twJoin(`
  z-50 min-h-screen w-full 
  flex flex-col justify-center
  font-inter
  pt-[80px] sm:pt-0
  items-start sm:items-center
  bg-transparent sm:bg-black/30 
`);

const twForm = twJoin(`
  px-[30px] py-[30px]
  flex flex-col
  bg-white
  w-full sm:w-[600px] 
  h-full sm:h-[580px] 
  flex-grow sm:flex-grow-0
  rounded-[0px] md:rounded-[5px]
`);

const twFlexContainer = twJoin(`
  flex flex-col
`);

const twTitle = twJoin(`
  mb-[24px]
  font-medium leading-[42px] text-[30px]
`);

const twLabel = twJoin(`
  mb-[4.5px]
  font-medium leading-[26px] text-[#838383]
`);

const twInput = twJoin(`
  w-full h-[50px] mb-[15.5px] px-[19px] pt-0
  outline-none border rounded-[5px] border-[#D4D4D4]
  placeholder-[#838383] caret-black/70
  focus:border-[#838383]
`);

const twUrlContainer = twJoin(`
  relative h-[50px] mb-[16px]
  flex flex-row items-center 
`);

const twUrlLeft = twJoin(`
  z-10 absolute h-[50px] px-[19px] py-[12.5px] 
  bg-[#F3F3F3] text-[#838383] 
  border rounded-[5px] rounded-tr-none rounded-br-none border-r-[#D4D4D4]
`);

const twTextArea = twJoin(`
  w-full px-[19px] py-3 mb-[25px]
  flex flex-grow 
  outline-none border rounded-[5px] border-[#D4D4D4]
  caret-black/70 leading-[26px]
  focus:border-[#838383]
  resize-none
`);
