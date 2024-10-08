'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import {
  NameIcon,
  EmailIcon,
  PasswordIcon,
  PasswordVisibilityIcon
} from '@/components/[common-ui]/icons';
import Button from '@/components/[common-ui]/button';
import { REGISTRATION_STRING, LOGIN_STRING } from '@/config/public';
import { classesBeautify } from '@/utils/styles';
import * as actions from '@/actions';

const loginPageConfig = {
  title: 'Вход в Yoldi Agency',
  submitButtonText: 'Войти',
  submitButtonTooltip: 'Войти в аккаунт используя почту и пароль',
  updateUrlOnPageLoad: `?method=${LOGIN_STRING}`,
} as const;

const registrationPageConfig = {
  title: 'Регистрация\nв Yoldi Agency',
  submitButtonText: 'Создать аккаунт',
  submitButtonTooltip: 'Создать аккаунт используя почту и пароль',
  updateUrlOnPageLoad: `?method=${REGISTRATION_STRING}`,
} as const;

const defaultInputValues = {
  name: '', // 'Владислав',
  email: '', // 'example@gmail.com',
  password: '', // 'password123!',
};

export default function AuthForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlMethod = searchParams.get('method');
  const urlErrorMessage = searchParams.get('error');

  const formUrl = `${pathname}?method=${urlMethod}`;

  const isRegistrationPage = urlMethod === REGISTRATION_STRING;
  const pageConfig = isRegistrationPage ? registrationPageConfig : loginPageConfig;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [ name, setName ] = useState(defaultInputValues.name);
  const [ email, setEmail ] = useState(defaultInputValues.email);
  const [ password, setPassword ] = useState(defaultInputValues.password);
  const [ passwordInputType, setPasswordInputType ] = useState('password');

  const [ errorMsg, setErrorMsg ] = useState(urlErrorMessage || null);
  
  const isPasswordEmpty = password == '';

  const isFieldsFilledForRegistration = !!name && !!email && !!password;
  const isFieldsFilledForLogin = !!email && !!password;

  const isFieldsFilled = isRegistrationPage
    ? isFieldsFilledForRegistration
    : isFieldsFilledForLogin;

  useEffect(() => {
    if (!urlMethod) {
      router.push(pageConfig.updateUrlOnPageLoad);
    }
  }, []);

  useEffect(() => {
    isRegistrationPage
      ? nameInputRef.current?.focus()
      : emailInputRef.current?.focus();
  }, [isRegistrationPage]);

  useEffect(() => {
    if (urlErrorMessage) {
      router.push(`?method=${urlMethod}`);
      toast.error(urlErrorMessage);
    }
    setTimeout(() => setErrorMsg(null), 10000);
  }, [urlErrorMessage]);

  return (
    <div className={twContainer}>
      <h1 className={twTitle}>{pageConfig.title}</h1>

      <form action={actions.credetialsSignIn.bind(null, { form_url: formUrl })}>

        <div className={twInputFieldsContainer}>
          
          {isRegistrationPage && (
            <div className={twInputFieldContainer}>
              <input
                className={twInputField}
                ref={nameInputRef}
                type="text"
                name="name"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className={twMerge(twSvgContainer, 'top-[15.5px] left-[24px]')}>
                <NameIcon />
              </span>
            </div>
          )}

          <div className={twInputFieldContainer}>
            <input
              className={twInputField}
              ref={emailInputRef}
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={twMerge(twSvgContainer, 'top-[18.5px] left-[22px]')}>
              <EmailIcon />
            </span>
          </div>

          <div className={twInputFieldContainer}>
            <input
              className={twMerge(twInputField, 'pr-14')}
              type={passwordInputType}
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={twMerge(twSvgContainer, 'top-[14.5px] left-[24px]')}>
              <PasswordIcon />
            </span>
            <span
              className={twMerge(
                twSvgContainer,
                'right-[20px] pt-[18.5px] h-[50px] cursor-pointer',
                isPasswordEmpty && 'opacity-50'
              )}
              onClick={() => {
                setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
              }}
            >
              <PasswordVisibilityIcon />
            </span>
          </div>

          {errorMsg && (
            <div className={twErrorContainer}>
              <p className="text-red-600">Authentification error</p>
              <ul >
                {errorMsg.split(' | ').map((error) => (
                  <li key={error}>* {error}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <Button 
          className="w-full"
          type="submit"
          title={pageConfig.submitButtonTooltip}
          size="big"
          colors="dark"
          disabled={!isFieldsFilled}
        >
          {pageConfig.submitButtonText}
        </Button>

      </form>
      
      <div className={twOAuthHintContainer}>
        <div className={twOAuthHintLine} />
        <div className={twOAuthHintText}>ИЛИ ВОЙТИ ЧЕРЕЗ СОЦИАЛЬНУЮ СЕТЬ</div>
        <div className={twOAuthHintLine} />
      </div>

      <div className={twOAuthButtonsContainer}>
        <form action={actions.googleSignIn} className="w-full">
          <Button
            className="w-full"
            type="submit"
            title="Войти через Google"
            size="big"
            colors="light"
          >
            Google
          </Button>
        </form>

        <form action={actions.githubSignIn} className="w-full">
          <Button
            className="w-full"
            type="submit"
            title="Войти через GitHub"
            size="big"
            colors="light"
          >
            GitHub
          </Button>
        </form>
      </div>
    </div>
  );
}

const twContainer = classesBeautify(`
  w-[400px] mx-auto flex flex-col
  bg-white font-inter border-[#E6E6E6] rounded-[5px]
  border-0 xs:border
  my-[0px] xs:my-auto
  px-[31px] xs:px-[29px]
  py-[30px] xs:py-[29px] 
`);

const twTitle = classesBeautify(`
  mb-[25px]
  font-medium text-[30px] leading-[42px] whitespace-pre-line
`);

const twInputFieldsContainer = classesBeautify(`
  mb-[10px]
  px-0 xs:px-[5px] 
`);

const twInputFieldContainer = classesBeautify(`
  relative mb-[15px] 
`);

const twInputField = classesBeautify(`
  h-[50px] w-full py-5 pl-[54px] pr-5
  outline-none border rounded-[5px] border-[#D4D4D4]
  placeholder-[#838383] caret-black/70
  focus:border-[#838383]
`);

const twSvgContainer = classesBeautify(`
  absolute w-[25px] h-[25px]
`);

const twOAuthHintContainer = classesBeautify(`
  w-full my-5 flex items-center justify-center
`);

const twOAuthHintLine = classesBeautify(`
  flex-grow
  border-t border-[#D4D4D4]
  hidden xs:block
`);

const twOAuthHintText = classesBeautify(`
  w-auto mx-4 flex-grow-0
  text-xs text-[#838383] text-center 
`);

const twOAuthButtonsContainer = classesBeautify(`
  flex flex-row gap-[10px]
`);

const twErrorContainer = classesBeautify(`
  w-full px-2 py-2 mb-4 flex flex-col justify-center
  text-black bg-red-50 rounded-[5px]
`);