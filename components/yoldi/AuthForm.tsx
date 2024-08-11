'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import tw from 'tailwind-styled-components';
import clsx from 'clsx';

import {
  NameIcon,
  EmailIcon,
  PasswordIcon,
  PasswordVisibilityIcon
} from '@/components/yoldi/Icons';

import { REGISTRATION_PAGE_STRING, LOGIN_PAGE_STRING, ROOT_PATH } from '@/lib/constants';
import ButtonLarge from '@/components/yoldi/ButtonLarge';

const constants = {
  [REGISTRATION_PAGE_STRING]: {
    formTitle: 'Регистрация\nв Yoldi Agency',
    submitButtonText: 'Создать аккаунт',
  },
  [LOGIN_PAGE_STRING]: {
    formTitle: 'Вход в Yoldi Agency',
    submitButtonText: 'Войти',
  },
  defaultStates: {
    name: 'Владислав',
    email: 'example@gmail.com',
    password: '0123456789',
    passwordInputType: 'password',
  },
  afterAuthRedirect: `${ROOT_PATH}/yoldi/profile`
};

export default function AuthForm() {
  const searchParams = useSearchParams();
  const isRegistrationPage = searchParams.get('method') === REGISTRATION_PAGE_STRING;
  const redirect = searchParams.get('callbackUrl') || 'http://localhost:3000';

  const pageData = isRegistrationPage
    ? constants[REGISTRATION_PAGE_STRING]
    : constants[LOGIN_PAGE_STRING];

  const defaults = constants.defaultStates;
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [password, setPassword] = useState(defaults.password);
  const [passwordInputType, setPasswordInputType] = useState(defaults.passwordInputType);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const isFieldsFilledForRegistration = Boolean(name) && Boolean(email) && Boolean(password);
  const isFieldsFilledForLogin = Boolean(email) && Boolean(password);

  const isFieldsFilled = isRegistrationPage
    ? isFieldsFilledForRegistration
    : isFieldsFilledForLogin;

  const isPasswordEmpty = password == '';

  useEffect(() => {
    isRegistrationPage
      ? nameInputRef.current?.focus()
      : emailInputRef.current?.focus();
  }, [isRegistrationPage]);

  const switchPasswordVisibility = () => {
    const newType = passwordInputType === 'password' ? 'text' : 'password';
    setPasswordInputType(newType);
  };

  const formSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn('credentials', {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: redirect
    });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            ref={passwordInputRef}
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

      <SubmitButton
        className={clsx(!isFieldsFilled && 'bg-[#d4d4d4] text-[#f3f3f3]')}
        disabled={!isFieldsFilled}
        type="submit"
      >
        {pageData.submitButtonText}
      </SubmitButton>
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

const SubmitButton = tw(ButtonLarge)`
  mt-[10px]
`;
