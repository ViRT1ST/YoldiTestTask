'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import tw from 'tailwind-styled-components';
import clsx from 'clsx';

import {
  NameIcon,
  EmailIcon,
  PasswordIcon,
  PasswordVisibilityIcon
} from '@/components/yoldi/ui/Icons';

import {
  REGISTRATION_PAGE_STRING,
  LOGIN_PAGE_STRING,
} from '@/lib/constants';

import ButtonThirdParty from '@/components/yoldi/auth/ButtonThirdParty';
import ButtonCredentials from '@/components/yoldi/auth/ButtonCredentials';

const constants = {
  [REGISTRATION_PAGE_STRING]: {
    formTitle: 'Регистрация\nв Yoldi Agency',
    submitButtonText: 'Создать аккаунт',
    submitButtonTooltip: 'Создать аккаунт используя почту и пароль',
  },
  [LOGIN_PAGE_STRING]: {
    formTitle: 'Вход в Yoldi Agency',
    submitButtonText: 'Войти',
    submitButtonTooltip: 'Войти в аккаунт используя почту и пароль',
  },
  defaultStates: {
    name: 'Владислав', //'Владислав',
    email: 'example@gmail.com', //'example@gmail.com',
    password: 'password123!', // 'password123!',
  },
};

export default function AuthForm() {
  const searchParams = useSearchParams();
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_PAGE_STRING;
  const errorMessage = searchParams.get('error');

  const pageData = isRegistrationPage
    ? constants[REGISTRATION_PAGE_STRING]
    : constants[LOGIN_PAGE_STRING];

  const defaults = constants.defaultStates;
  const [username, setUsername] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [password, setPassword] = useState(defaults.password);
  const [passwordInputType, setPasswordInputType] = useState('password');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isPasswordEmpty = password == '';

  const isFieldsFilledForRegistration = !!username && !!email && !!password;
  const isFieldsFilledForLogin = !!email && !!password;

  const isFieldsFilled = isRegistrationPage
    ? isFieldsFilledForRegistration
    : isFieldsFilledForLogin;

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    // setUsername('');
    // setEmail('');
    // setPassword('');
    
    isRegistrationPage
      ? nameInputRef.current?.focus()
      : emailInputRef.current?.focus();
  }, [isRegistrationPage]);

  const switchPasswordVisibility = () => {
    setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
  };

  const formSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('form submit');    
  };

  return (
    <Form onSubmit={formSubmitHandler}>
      <Title>{pageData.formTitle}</Title>

      <AllInputFieldsContainer>
        {isRegistrationPage && (
          <InputFieldContainer>
            <InputField
              ref={nameInputRef}
              type="text"
              name="user_name"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
    
            <SvgContainer className="top-[15.5px] left-[24px]">
              <NameIcon />
            </SvgContainer>
          </InputFieldContainer>
        )}

        <InputFieldContainer>
          <InputField
            ref={emailInputRef}
            type="email"
            name="user_email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <SvgContainer className="top-[18.5px] left-[22px]">
            <EmailIcon />
          </SvgContainer>
        </InputFieldContainer>

        <InputFieldContainer>
          <InputField
            className="pr-14"
            type={passwordInputType}
            name="user_password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <SvgContainer className="top-[14.5px] left-[24px]">
            <PasswordIcon />
          </SvgContainer>

          <SvgContainer
            className={clsx(
              'right-[20px] pt-[18.5px] h-[50px] cursor-pointer',
              isPasswordEmpty && 'opacity-50'
            )}
            onClick={switchPasswordVisibility}
          >
            <PasswordVisibilityIcon />
          </SvgContainer>
        </InputFieldContainer>
      </AllInputFieldsContainer>

      <ButtonCredentials
        label={pageData.submitButtonText}
        tooltip={pageData.submitButtonTooltip}
        isFieldsFilled={isFieldsFilled}
        credentials={{
          name: username,
          email: email,
          password: password,
          isRegistrationPage: isRegistrationPage,
        }}
      />

      <SocialAuthHintContainer>
        <SocialAuthHintLine />
        <SocialAuthHintText>ИЛИ ВОЙТИ ЧЕРЕЗ СОЦИАЛЬНУЮ СЕТЬ</SocialAuthHintText>
        <SocialAuthHintLine />
      </SocialAuthHintContainer>

      <SocialAuthButtonsContainer>
        <ButtonThirdParty label="Google" provider="google" />
        <ButtonThirdParty label="GitHub" provider="github" />
      </SocialAuthButtonsContainer>
    </Form>
  );
}

const Form = tw.form`
  w-[400px] mx-auto
  flex flex-col
  border-[#E6E6E6] rounded-[5px]
  bg-white font-inter
  border-0 xs:border
  my-[0px] xs:my-auto
  px-[31px] xs:px-[29px]
  py-[30px] xs:py-[29px] 
`;

const Title = tw.h1`
  mb-[25px]
  font-medium text-[30px] leading-[42px] whitespace-pre-line
`;

const AllInputFieldsContainer = tw.div`
  mb-[10px]
  px-0 xs:px-[5px] 
`;

const InputFieldContainer = tw.div`
  relative mb-[15px] 
`;

const InputField = tw.input`
  h-[50px] w-full py-5 pl-[54px] pr-5
  outline-none border rounded-[5px] border-[#D4D4D4]
  placeholder-[#838383] caret-black/70
  focus:border-[#838383]
`;

const SvgContainer = tw.span`
  absolute w-[25px] h-[25px]
`;

const SocialAuthHintContainer = tw.div`
  w-full my-5 
  flex items-center justify-center
`;

const SocialAuthHintLine = tw.div`
  flex-grow
  border-t border-[#D4D4D4]
  hidden xs:block
`;

const SocialAuthHintText = tw.div`
  w-auto mx-4
  flex-grow-0
  text-xs text-[#838383] text-center 
`;

const SocialAuthButtonsContainer = tw.div`
  flex flex-row gap-[10px]
`;

