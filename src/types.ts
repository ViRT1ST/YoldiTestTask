import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';

/* =============================================================
Database Schemas And Types
============================================================= */

export type DbUser = {
  id: number;
  uuid: string;
  default_auth_provider: string;
  google_id: string;
  github_id: string;
  auth_email: string;
  auth_password: string;
  alias_default: string;
  alias_custom: string;
  name: string;
  avatar: string;
  profile_cover: string;
  profile_about: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
};

export type DbUserOrUndef = DbUser | undefined;

/* =============================================================
Other Types
============================================================= */

export type AnyFieldsObject = {
  [key: string]: any;
};

export type OauthProviders = (
  'google' | 'github'
);

export type ApiResponse = {
  success: boolean;
  code: number | string;
  data: object | null;
  message: string | null;
};

export type AuthFormData = {
  name: string | null,
  email: string,
  password: string,
  isRegistrationPage: boolean,
}

export type SessionWithExtraData = ({
  user?: {
    iat?: number;
    exp?: number;
    jti?: string;
    iss?: string;
    uuid?: string;
    name?: string;
    avatar?: string | null;
    alias?: string;
    is_admin?: boolean
    provider_data?: {
      name?: string;
      email?: string;
      password?: string;
      callbackUrl?: string;
      formUrl?: string;
      sub?: string,
      picture?: string;
      login?: string;
      id?: number;
      avatar_url?: string;
    },
    replace_data?: {
      iss: string;
      uuid: string;
      name: string;
      avatar: string | null;
      alias: string;
      is_admin: boolean
    }
  } | undefined | null;
}) | undefined | null;

export type AuthConstants = {
  [REGISTRATION_STRING]: {
    question: string;
    label: string;
    path: string;
  };
  [LOGIN_STRING]: {
    question: string;
    label: string;
    path: string;
  };
  authPageUrlPart: string;
}

export type ProfileInfo = {
  name: string,
  alias: string,
  about: string
}

