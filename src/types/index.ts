import { z } from 'zod';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/config/public';

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
Common
============================================================= */

export type Slug = {
  params: {
    'slug': string
  }
};

export type CatchAllSlug = {
  params: {
    'slug': string[]
  }
};

/* =============================================================
Other
============================================================= */

export type OauthProviders = (
  'google' | 'github'
);

export type SessionMainFields = {
  iat?: number;
  exp?: number;
  jti?: string;
  iss?: string;
  uuid?: string;
  name?: string;
  avatar?: string | null;
  alias?: string;
  is_admin?: boolean;
};

export type SessionWithBaseData = ({
  user: SessionMainFields
}) | null;

export type SessionWithProviderData = SessionWithBaseData & {
  user: {
    provider_data?: {
      name?: string;
      email?: string;
      password?: string;
      form_url?: string;
      sub?: string,
      picture?: string;
      login?: string;
      id?: number;
      avatar_url?: string;
    }
  }
};

export type SessionWithUpdateData = SessionWithBaseData & {
  user: {
    replace_data: {
      iss?: string;
      uuid?: string;
      name?: string;
      avatar?: string | null;
      alias?: string;
      is_admin?: boolean
    }
  }
};

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
  authPagePath: string;
};

export type DataToShowProfile = {
  isAuthenticatedToEdit: boolean;
  uuid: string;
  avatar: string | null;
  name: string;
  alias: string;
  cover: string | null;
  about: string | null;
  providerStamp: string;
};

export type ProfileNewInfo = {
  uuid?: string;
  name: string;
  alias?: string;
  about: string;
};

export type ErrorForRedirect = {
  message: string;
  code: number
} | null;
