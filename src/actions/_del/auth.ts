import type { CredentialInput } from 'next-auth/providers/credentials';
import type { Account, Profile } from 'next-auth';
import bcrypt from 'bcryptjs';

import { LOGIN_STRING, REGISTRATION_STRING } from '@/constants';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';


/* =============================================================
Types for this file only
============================================================= */

type initialAuthData = {
  provider: string;
  email?: string;
  password?: string;
  name?: string | null;
  id?: string | number;
  avatar?: string;
}

/* =============================================================
Utils for this file only
============================================================= */

const modifyGoogleAvatarSize = (imageUrl: string) => {
  if (typeof imageUrl === 'string') {
    imageUrl = imageUrl.replace('s96-c', 's512-c');
  }

  return imageUrl;
};

/* =============================================================
Getting initial user data
============================================================= */

interface getInitialAuthDataProps {
  account: Account;
  profile: Profile;
  credentials: Record<string, CredentialInput>;
}

function getInitialAuthData({ account, profile, credentials }: getInitialAuthDataProps) {
  const data: initialAuthData = {
    provider: account.provider
  };

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


/* =============================================================
Creating or authenticating user
============================================================= */

async function authOrRegisterCredentialsUser(authData: any) {
  const { name, email, password, isRegistrationPage } = authData;

  const foundUser = await pg.getUserByAuthEmail(email);

  // Registration form: found existing user
  if (isRegistrationPage && foundUser) {
    validator.throwError(400, 'User already exists');
  }

  // Registration form: user not found -> new user registration
  if (isRegistrationPage && !foundUser) {
    const newUser = await pg.createUserByAuthEmail(email, password, name);
    
    if (!newUser) {
      validator.throwError(400, 'Error creating new user');
    }
  }

  // Login form: user is not found with provided email
  if (!isRegistrationPage && !foundUser) {
    validator.throwError(400, 'User not found');
  }

  // Login form: user found -> checking password for existing user
  if (!isRegistrationPage && foundUser) {
    const match = await bcrypt.compare(password, foundUser.credentials_password);

    if (!match) {
      validator.throwError(400, 'Invalid password');
    }
  }
}

async function authOrRegisterOauthUser(authData: any) {
  const { id, name, avatar, provider,  } = authData;

  const existedUser = await pg.getUserByAuthId(provider, id);

  if (!existedUser) {
    const newUser = await pg.createUserByAuthId(provider, id, name, avatar);

    if (!newUser) {
      validator.throwError(400, 'Error creating new user');
    }
  } 

  return true;
}

export async function authOrRegisterUser(account: any, profile: any, credentials: any) {
  try {
    const authData = getInitialAuthData({ account, profile, credentials } );

    if (authData.provider === 'credentials') {
      await authOrRegisterCredentialsUser(authData);
    } else {
      await authOrRegisterOauthUser(authData);
    }
  
    // sucessful login
    return true;

  } catch (error: any) {
    const authMethod = credentials?.isRegistrationPage === 'true'
      ? REGISTRATION_STRING
      : LOGIN_STRING;
    const message = error.message || 'Unknown error';
    const code = error.code || 500;

    // failed login
    return `/yoldi/auth?method=${authMethod}&error=${message}&code=${code}`;
  }
}

/* =============================================================
Modifying Next Auth Objects
============================================================= */

export async function modifyToken(token: any, account: any, profile: any) {
  if (!token || !account) {
    return;
  }


  const provider = account.provider;
  token.iss = provider;

  switch(provider) {
    case 'credentials':
      // don't need to modify sub and email (already in token)
      break;
    case 'google':
      token.sub = profile.sub;
      token.email = null;
      // token.picture = token.picture;
      break;
    case 'github':
      token.sub = profile.id;
      token.email = null;
      // token.picture = profile.avatar_url;
      break;
  }
}



export async function modifySession(session: any, token: any) {
  if (!session || !token) {
    return;
  }

  const provider = token?.iss;
  const id = token?.sub;
  const image = token?.picture;
  const authEmail = token?.email;

  let user;
  if (provider === 'credentials') {
    user = await pg.getUserByAuthEmail(authEmail);
  } else {
    user = await pg.getUserByAuthId(provider, id);
  }

  if (user) {
    session.user = {
      uuid: user.uuid,
      provider: provider,
      profile_avatar: user.profile_avatar || image || null,
      profile_url: user.profile_url_custom || user.profile_url_default,
      profile_name: user.profile_name,
      is_admin: user.is_admin,
    };
  }
}