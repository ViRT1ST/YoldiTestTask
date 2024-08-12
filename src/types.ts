import { User } from 'next-auth';
import { z } from 'zod';

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

export type userWithExtraData = User & ({
  provider_data?: {
    name?: string;
    email?: string;
    password?: string;
    callbackUrl?: string;
    formUrl?: string;
    sub: string,
    picture: string;
    login: string;
    id: number;
    avatar_url: string;
  }
  iss?: string
}) | undefined;
