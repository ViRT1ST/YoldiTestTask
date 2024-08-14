'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import tw from 'tailwind-styled-components';
import clsx from 'clsx';

import {
  NameIcon,
  EmailIcon,
  PasswordIcon,
  PasswordVisibilityIcon
} from '@/components/yoldi-common/icons';
import ButtonLarge from '@/components/yoldi-common/button-large';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';
import * as actions from '@/actions';

const pageDataSwitch = {
  [REGISTRATION_STRING]: {
    title: 'Регистрация\nв Yoldi Agency',
    submitButtonText: 'Создать аккаунт',
    submitButtonTooltip: 'Создать аккаунт используя почту и пароль',
  },
  [LOGIN_STRING]: {
    title: 'Вход в Yoldi Agency',
    submitButtonText: 'Войти',
    submitButtonTooltip: 'Войти в аккаунт используя почту и пароль',
  },
};

const defaultInputValues = {
  name: '', //'Владислав',
  email: 'example@gmail.com', //'example@gmail.com',
  password: 'password123!', // 'password123!',
};

export default function AuthForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlMethod = searchParams.get('method');
  const urlErrorMessage = searchParams.get('error');

  const formUrl = `${pathname}?method=${urlMethod}`;

  const isRegistrationPage = urlMethod === REGISTRATION_STRING;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(defaultInputValues.name);
  const [email, setEmail] = useState(defaultInputValues.email);
  const [password, setPassword] = useState(defaultInputValues.password);
  const [passwordInputType, setPasswordInputType] = useState('password');

  const [errorMsg, setErrorMsg] = useState(urlErrorMessage || null);
  
  const pageData = isRegistrationPage
    ? pageDataSwitch[REGISTRATION_STRING]
    : pageDataSwitch[LOGIN_STRING];

  const isPasswordEmpty = password == '';

  const isFieldsFilledForRegistration = !!name && !!email && !!password;
  const isFieldsFilledForLogin = !!email && !!password;

  const isFieldsFilled = isRegistrationPage
    ? isFieldsFilledForRegistration
    : isFieldsFilledForLogin;

  useEffect(() => {
    if (urlErrorMessage) {
      router.push(`?method=${urlMethod}`);
      toast.error(urlErrorMessage);
    }

    setTimeout(() => setErrorMsg(null), 10000);
  }, [urlErrorMessage]);

  useEffect(() => {
    isRegistrationPage
      ? nameInputRef.current?.focus()
      : emailInputRef.current?.focus();
  }, [isRegistrationPage]);

  // delete later
  // useEffect(() => {
  //   router.push(`?method=${isRegistrationPage ? REGISTRATION_STRING : LOGIN_STRING}`);
  // }, []);

  return (
    <Container>
      <Title>{pageData.title}</Title>

      <form action={actions.credetialsSignIn.bind(null, { formUrl })}>
        <AllInputFieldsContainer>
          {isRegistrationPage && (
            <InputFieldContainer>
              <InputField
                ref={nameInputRef}
                type="text"
                name="name"
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
            <input
              className={inputFieldClasses}
              ref={emailInputRef}
              type="email"
              name="email"
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
              name="password"
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
              onClick={() => {
                setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
              }}
            >
              <PasswordVisibilityIcon />
            </SvgContainer>
          </InputFieldContainer>

          {errorMsg && (
            <ErrorContainer>
              <p className="text-red-600">Authentification error</p>
              <ul >
                {errorMsg.split(' | ').map((error) => (
                  <li key={error}>* {error}</li>
                ))}
              </ul>
            </ErrorContainer>
          )}

        </AllInputFieldsContainer>

        <ButtonLarge
          className={clsx('w-full')}
          type="submit"
          light={false}
          title={pageData.submitButtonTooltip}
          disabled={!isFieldsFilled}
        >
          {pageData.submitButtonText}
        </ButtonLarge>

      </form>
      
      <SocialAuthHintContainer>
        <SocialAuthHintLine />
        <SocialAuthHintText>ИЛИ ВОЙТИ ЧЕРЕЗ СОЦИАЛЬНУЮ СЕТЬ</SocialAuthHintText>
        <SocialAuthHintLine />
      </SocialAuthHintContainer>

      <SocialAuthButtonsContainer>
        <form action={actions.googleSignIn} className="w-full">
          <ButtonLarge
            className="w-full"
            type="submit"
            light={true}
            title={'Войти через Google'}
          >
            Google
          </ButtonLarge>
        </form>

        <form action={actions.githubSignIn} className="w-full">
          <ButtonLarge
            className="w-full"
            type="submit"
            light={true}
            title={'Войти через GitHub'}
          >
            GitHub
          </ButtonLarge>
        </form>
      </SocialAuthButtonsContainer>
    </Container>
  );
}

const Container = tw.div`
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

const inputFieldClasses = clsx(
  'h-[50px] w-full py-5 pl-[54px] pr-5',
  'outline-none border rounded-[5px] border-[#D4D4D4]',
  'placeholder-[#838383] caret-black/70',
  'focus:border-[#838383]'
);

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

const ErrorContainer = tw.div`
  w-full px-2 py-2 mb-4 flex flex-col justify-center
  text-black bg-red-50 rounded-[5px]
`;