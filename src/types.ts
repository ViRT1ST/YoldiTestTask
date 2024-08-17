import { User } from 'next-auth';
import { z } from 'zod';

import { REGISTRATION_STRING, LOGIN_STRING } from '@/constants';

/* =============================================================
Database Schemas And Types
============================================================= */

export const DbUserSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  email: z.string(),
  email_lowercase: z.string(),
  username: z.string(),
  password: z.string(),
  is_admin: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type DbUser = z.infer<typeof DbUserSchema>;

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
  iss?: string;
  user?: {
    iss?: string;
    uuid?: string;
    avatar?: string | null;
    alias?: string;
    name?: string;
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
    user_replace_data?: {
      iss: string;
      uuid: string;
      avatar: string | null;
      alias: string;
      name: string;
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