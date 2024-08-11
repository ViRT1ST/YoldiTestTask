export const ROOT_PATH = process.env.NEXT_PUBLIC_DOMAIN;
export const API_PATH = `${process.env.NEXT_PUBLIC_DOMAIN}/api`;

export const REGISTRATION_PAGE_STRING = 'registration';
export const LOGIN_PAGE_STRING = 'login';

export const AUTH_SUCCESS_REDIRECT = `${ROOT_PATH}/yoldi/profile`;
export const AUTH_FAILURE_REDIRECT = `${ROOT_PATH}/yoldi/auth?method=${LOGIN_PAGE_STRING}`;
