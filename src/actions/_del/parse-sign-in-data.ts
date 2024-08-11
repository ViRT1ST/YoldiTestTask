import { z } from 'zod';

import type { CredentialInput } from 'next-auth/providers/credentials';
import type { Account, Profile } from 'next-auth';




import validator from '@/lib/backend/validator';


type signInData = {
  provider: string;
  email?: string;
  password?: string;
  name?: string | null;
  id?: string | number;
  avatar?: string;
}

const modifyGoogleAvatarSize = (imageUrl: string) => {
  if (typeof imageUrl === 'string') {
    imageUrl = imageUrl.replace('s96-c', 's512-c');
  }

  return imageUrl;
};

const credentialsRegistrationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Must be at least 3 characters'}),
  email: z
    .string()
    .min(3, { message: 'Must be at least 3 characters'}),
  password: z
    .string()
    .min(8, { message: 'Must be at least 8 characters'})
});

/* =============================================================
Getting initial user data
============================================================= */

interface getInitialAuthDataProps {
  account: Account;
  profile: Profile;
  credentials: Record<string, CredentialInput>;
}

function parseSignInData({ account, profile, credentials }: getInitialAuthDataProps) {
  const data: signInData = {
    provider: account.provider
  };

  if (data.provider === 'credentials') {
    const result = credentialsRegistrationSchema.safeParse({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors
      };
    }

    return { ...data, ...result };
  }

  

  const isRegistrationPage = Boolean(credentials?.name);

  switch(data.provider) {
    case 'credentials':
      data.email = validator.assertEmail(credentials.email);
      data.password = validator.assertPassword(credentials.password);
      data.name = isRegistrationPage
        ? validator.assertName(credentials.name)
        : null;
      break;
    case 'google':
      data.id = validator.assertString(profile.sub, 'Google ID');
      data.name = validator.assertString(profile.name, 'Google Name');
      data.avatar = modifyGoogleAvatarSize(profile.picture);
      break;
    case 'github': 
      data.id = validator.assertNumber(profile.id, 'GitHub ID');
      data.name = validator.assertString(profile.login, 'GitHub Name');
      data.avatar = validator.assertString(profile.avatar_url, 'GitHub Avatar');
      break;
  }

  return data;
}
