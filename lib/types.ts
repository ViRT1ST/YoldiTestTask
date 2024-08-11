import { z } from 'zod';

/* =============================================================
Database Full Schemas And Types
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

export type ApiResponse = {
  success: boolean;
  code: number;
  data: object | null;
  message: string | null;
};

export type UserUpdateData = {
  uuid: string;
  new_email?: string | undefined;
  new_password?: string | undefined;
  new_username?: string | undefined;
};

