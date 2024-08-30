// This file contains constants accessible on client
// Don't write here any sensitive data

const isDevMode = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_MODE === 'true';

export const ROOT_PATH = isDevMode
  ? process.env.NEXT_PUBLIC_DOMAIN_DEVELOPMENT
  : process.env.NEXT_PUBLIC_DOMAIN_PRODUCTION;

export const PATH_TO_AUTH_PROCESSOR = '/yoldi/auth/pass';

export const REGISTRATION_STRING = 'registration';
export const LOGIN_STRING = 'login';


