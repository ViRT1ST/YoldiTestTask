import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';

import { DbUser, UserUpdateData } from '@/lib/types';
// import bcrypt from '@/lib/backend/utils/bcrypt';
import validator from '@/lib/backend/validator';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function checkEmailIsNotExist(email: string): Promise<void | never> {
  const query = `
    SELECT email_lowercase
    FROM users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  if (rows[0]) {
    validator.throwError(400, 'This email is already associated with an account.');
  }
}


async function createUser(email: string, password: string, username: string):
  Promise<void | never> {
  
  // await checkEmailIsNotExist(email);

  // const uuid = uuidv4();
  // const hashedPassword = await bcrypt.hashPassword(password);

  // const query = `
  //   INSERT INTO users (uuid, email, email_lowercase, username, password)
  //   VALUES ($1, $2, LOWER($2), $3, $4)
  // `;
  
  // await pool.query(query, [uuid, email, username, hashedPassword]);
}

async function getUserByEmail(email: string): Promise<DbUser | never> {
  const query = `
    SELECT *
    FROM users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);
  const user = validator.assertUser(rows[0]);

  return user;
}


async function updateUser(data: UserUpdateData): Promise<void> {
  const { uuid, new_email, new_username, new_password } = data;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  new_email && addParam('email', new_email);
  new_email && addParam('email_lowercase', new_email.toLowerCase());
  new_username && addParam('username', new_username);
  // new_password && addParam('password', await bcrypt.hashPassword(new_password));

  const query = `
    UPDATE users
    SET updated_at = NOW(), ${paramsForSet.join(', ')}
    WHERE uuid = $1
  `;

  await pool.query(query, paramsToPass);
}

export default {
  createUser,
  getUserByEmail,
  checkEmailIsNotExist,
  updateUser,
};


