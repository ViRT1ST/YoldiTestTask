import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

import type { DbUser, DbUserOrUndef, AnyFieldsObject, OauthProviders } from '@/types';
import { PG_CONFIG } from './config';

const pool = new Pool(PG_CONFIG);

// type promiseObjectOrUndefined = Promise<AnyFieldsObject | undefined>;

/* =============================================================
All users
============================================================= */

async function getUserByUuid(uuid: string): Promise<DbUserOrUndef> {
  const query = `
    SELECT *
    FROM users
    WHERE uuid = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [uuid]);

  return rows[0];
}

async function getUserByAlias(alias: string): Promise<DbUserOrUndef> {
  const query = `
    SELECT *
    FROM users
    WHERE alias_default = $1 OR alias_custom = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [alias]);

  return rows[0];
}

/* =============================================================
Users with authentication by email and password
============================================================= */

async function getUserByAuthEmail(email: string): Promise<DbUserOrUndef> {
  const query = `
    SELECT *
    FROM users
    WHERE LOWER(auth_email) = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0];
}

async function createUserByAuthEmail(
  email: string, password: string, profileName: string = 'Anonymous'
): Promise<DbUserOrUndef> {
  const query = `
    INSERT INTO users (default_auth_provider, auth_email, auth_password, name)
    VALUES ('credentials', $1, $2, $3)
    RETURNING *
  `;
  
  const hashedPassword = await bcrypt.hash(password, 8);
  const { rows } = await pool.query(query, [email, hashedPassword, profileName]);

  return rows[0];
}

/* =============================================================
Users with authentication by third party auth providers
============================================================= */

async function getUserByAuthId(provider: OauthProviders, id: string): Promise<DbUserOrUndef> {
  const query = `
    SELECT *
    FROM users
    WHERE ${provider}_id = ($1)::TEXT
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
}

async function createUserByAuthId(
  provider: OauthProviders, id: string, name: string = 'Anonymous', avatar: string
): Promise<DbUserOrUndef> {
  const query = `
    INSERT INTO users (default_auth_provider, ${provider}_id, name, avatar)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [provider, id, name, avatar]);
  return rows[0];
}

/* =============================================================
Update profile info
============================================================= */

async function updateProfile(data: any): Promise<DbUserOrUndef> {
  const { uuid, name, alias, about } = data;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  name && addParam('name', name);
  alias && addParam('alias_custom', alias);
  about && addParam('profile_about', about);
  
  if (paramsToPass.length < 2) {
    return;
  }

  const query = `
    UPDATE users
    SET updated_at = NOW(), ${paramsForSet.join(', ')}
    WHERE uuid = $1
  `;

  const { rows } = await pool.query(query, paramsToPass);

  return rows[0];
}

const dbQueries = {
  getUserByUuid,
  getUserByAlias,
  getUserByAuthEmail,
  createUserByAuthEmail,
  getUserByAuthId,
  createUserByAuthId,
  updateProfile
};

export default dbQueries;
