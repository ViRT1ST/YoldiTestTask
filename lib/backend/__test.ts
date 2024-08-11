
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});


export async function getUserByEmail(email: string) {
  const query = `
    SELECT *
    FROM users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
}





