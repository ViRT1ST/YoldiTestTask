import { z } from 'zod';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/config/public';
import { ERRORS } from '@/utils/errors';

/* =============================================================
Database Schemas And Types
============================================================= */

export type DbUser = {
  id: number;
  uuid: string;
  default_auth_provider: string;
  google_id: string | null;
  github_id: string | null;
  auth_email: string | null;
  auth_password: string | null;
  alias_default: string;
  alias_custom: string | null;
  name: string;
  avatar: string | null;
  profile_cover: string | null;
  profile_about: string | null;
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

export type ObjectWithAnyData = {
  [key: string]: any;
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

export const CredentialsLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: ERRORS.zodNotEmail[1] })
    .min(5, { message: ERRORS.zodBadEmail[1] }),
  password: z
    .string()
    .trim()
    .min(8, { message: ERRORS.zodBadPassword[1] })
});

export const CredentialsRegistrationSchema = CredentialsLoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: ERRORS.zodBadName[1] })
});

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: ERRORS.zodBadName[1] }),
  alias: z
    .string()
    .trim()
    .min(3, { message: ERRORS.zodBadAlias[1] })
    .optional()
    .or(z.literal('')),
  about: z
    .string()
    .min(1, { message: ERRORS.zodBadAbout[1] })
});
