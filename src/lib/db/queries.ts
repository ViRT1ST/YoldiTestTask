import bcrypt from 'bcryptjs';

import type { DbUserOrUndef, OauthProviders, DbUser, ProfileNewInfo } from '@/types';
import { defaultYoldiUsers } from '@/lib/db/reset-data/yoldi';
import executeQuery from './executor';

/* =============================================================
Create users table or clear it
============================================================= */

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      default_auth_provider TEXT NOT NULL,
      google_id TEXT DEFAULT NULL,
      github_id TEXT DEFAULT NULL,
      auth_email TEXT DEFAULT NULL,
      auth_password TEXT DEFAULT NULL,
      alias_default TEXT UNIQUE NOT NULL GENERATED ALWAYS AS ('id'::TEXT || id::TEXT) STORED,
      alias_custom TEXT DEFAULT NULL,
      name TEXT NOT NULL DEFAULT 'Anonymous',
      avatar TEXT DEFAULT NULL,
      profile_cover TEXT DEFAULT NULL,
      profile_about TEXT DEFAULT NULL,
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;

  await executeQuery(query);
}

async function clearUsersTable() {
  const query = `TRUNCATE users;`;

  await executeQuery(query);
}

/* =============================================================
All users
============================================================= */

async function getAllUsers() {
  const query = `
    SELECT *
    FROM users
    ORDER BY id
  `;

  const { rows } = await executeQuery(query);

  return rows as DbUser[];
}

async function getUserByUuid(uuid: string) {
  const query = `
    SELECT *
    FROM users
    WHERE uuid = $1
    LIMIT 1
  `;

  const { rows } = await executeQuery(query, [uuid]);
  return rows[0] as DbUserOrUndef;
}

async function getUserByAlias(alias: string) {
  const query = `
    SELECT *
    FROM users
    WHERE alias_default = $1 OR alias_custom = $1
    LIMIT 1
  `;

  const lowerAlias = alias.toLowerCase();

  const { rows } = await executeQuery(query, [lowerAlias]);
  return rows[0] as DbUserOrUndef;
}

/* =============================================================
Users with authentication by email and password
============================================================= */

async function getUserByAuthEmail(email: string) {
  const query = `
    SELECT *
    FROM users
    WHERE LOWER(auth_email) = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await executeQuery(query, [email]);
  return rows[0] as DbUserOrUndef;
}

async function createUserByAuthEmail(
  email: string, password: string, profileName: string = 'Anonymous'
) {
  const query = `
    INSERT INTO users (default_auth_provider, auth_email, auth_password, name)
    VALUES ('credentials', $1, $2, $3)
    RETURNING *
  `;
  
  const hashedPassword = await bcrypt.hash(password, 8);

  const { rows } = await executeQuery(query, [email, hashedPassword, profileName]);
  return rows[0] as DbUserOrUndef;
}

/* =============================================================
Users with authentication by third party auth providers
============================================================= */

async function getUserByAuthId(provider: OauthProviders, id: string) {
  const query = `
    SELECT *
    FROM users
    WHERE ${provider}_id = ($1)::TEXT
    LIMIT 1
  `;

  const { rows } = await executeQuery(query, [id]);
  return rows[0] as DbUserOrUndef;
}

async function createUserByAuthId(
  provider: OauthProviders, id: string, name: string = 'Anonymous', avatar: string
) {
  const query = `
    INSERT INTO users (default_auth_provider, ${provider}_id, name, avatar)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const { rows } = await executeQuery(query, [provider, id, name, avatar]);
  return rows[0] as DbUserOrUndef;
}

/* =============================================================
Update profile info
============================================================= */

async function updateProfileInfo(newInfo: ProfileNewInfo) {
  const { uuid, name, alias, about } = newInfo;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  name && addParam('name', name);
  alias && addParam('alias_custom', alias.toLowerCase());
  about && addParam('profile_about', about);
  
  if (paramsToPass.length < 2) {
    return;
  }

  const query = `
    UPDATE users
    SET updated_at = NOW(), ${paramsForSet.join(', ')}
    WHERE uuid = $1
  `;

  const { rows } = await executeQuery(query, paramsToPass);
  return rows[0] as DbUserOrUndef;
}

async function changeProfileCover(uuid: string, imageUrl: string) {
  const query = `
    UPDATE users
    SET profile_cover = $2
    WHERE uuid = $1
  `;

  const { rows } = await executeQuery(query, [uuid, imageUrl]);
  return rows[0] as DbUserOrUndef;
}

async function deleteProfileCover(uuid: string) {
  const query = `
    UPDATE users
    SET profile_cover = NULL
    WHERE uuid = $1
  `;

  const { rows } = await executeQuery(query, [uuid]);
  return rows[0] as DbUserOrUndef;
}

async function changeProfileAvatar(uuid: string, imageUrl: string) {
  const query = `
    UPDATE users
    SET avatar = $2
    WHERE uuid = $1
  `;

  const { rows } = await executeQuery(query, [uuid, imageUrl]);
  return rows[0] as DbUserOrUndef;
}

async function resetUsersTable() {
  try {
    await createUsersTable();
    await clearUsersTable();

    type UserForMapping = {
      [key: string]: any;
    };

    // Get the columns from the first user
    const columns = Object.keys(defaultYoldiUsers[0]);

    // Create array vith concatenated values as string
    const values = defaultYoldiUsers.map((user: UserForMapping) => (
      `(${columns.map((c) => user[c] !== null ? `'${user[c]}'` : 'NULL').join(', ')})`
    ));

    const query = `
      INSERT INTO users (${columns.join(', ')})
      VALUES ${values.join(', ')};
    `;

    await executeQuery(query);
  } catch {
    // Silence the error
  }
}

const dbQueries = {
  createUsersTable,
  clearUsersTable,
  getAllUsers,
  getUserByUuid,
  getUserByAlias,
  getUserByAuthEmail,
  createUserByAuthEmail,
  getUserByAuthId,
  createUserByAuthId,
  updateProfileInfo,
  changeProfileCover,
  deleteProfileCover,
  changeProfileAvatar,
  resetUsersTable
};

export default dbQueries;
