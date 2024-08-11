import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

import { AnyFieldsObject, OauthProviders } from '@/lib/types';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

/* =============================================================
All users
============================================================= */

async function getUserByUuid(
  uuid: string
): Promise<AnyFieldsObject | undefined> {

  const query = `
    SELECT *
    FROM users
    WHERE uuid = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [uuid]);

  return rows[0];
}

async function getUserByProfileUrl(
  profileUrl: string
): Promise<AnyFieldsObject | undefined> {

  const query = `
    SELECT *
    FROM users
    WHERE profile_url_default = $1 OR profile_url_custom = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [profileUrl]);

  return rows[0];
}

/* =============================================================
Users with authentication by email and password
============================================================= */

async function getUserByAuthEmail(
  email: string
): Promise<AnyFieldsObject | undefined | never> {

  const query = `
    SELECT *
    FROM users
    WHERE LOWER(credentials_email) = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0];
}

async function createUserByAuthEmail(
  email: string, password: string, profileName: string = 'Anonymous'
): Promise<AnyFieldsObject | undefined | never> {
  
  const hashedPassword = await bcrypt.hash(password, 8);

  const query = `
    INSERT INTO users (default_provider, credentials_email, credentials_password, profile_name)
    VALUES ('credentials', $1, $2, $3)
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [email, hashedPassword, profileName]);

  return rows[0];
}

/* =============================================================
Users with authentication by third party auth providers
============================================================= */

async function getUserByAuthId(
  provider: OauthProviders, id: string
): Promise<AnyFieldsObject | undefined | never> {

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
): Promise<AnyFieldsObject | undefined | never> {
  
  const query = `
    INSERT INTO users (default_provider, ${provider}_id, profile_name, profile_avatar)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [provider, id, name, avatar]);
  return rows[0];
}

/* =============================================================
Update profile info
============================================================= */

async function updateProfile(
  data: any
): Promise<AnyFieldsObject | undefined | never> {
  const { uuid, name, about, idForUrl } = data;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  name && addParam('profile_name', name);
  about && addParam('profile_about', about);
  idForUrl && addParam('profile_url_custom', idForUrl);

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

export default {
  getUserByUuid,
  getUserByProfileUrl,
  getUserByAuthEmail,
  createUserByAuthEmail,
  getUserByAuthId,
  createUserByAuthId,
  updateProfile
};


