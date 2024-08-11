require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const createYoldiUsersTableQuery = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    email TEXT,
    email_lowercase TEXT,
    username TEXT DEFAULT 'Anonymous',
    password TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )
`;

const addAccountsYoldiUsers = `
  INSERT INTO users (
    uuid,
    email,
    email_lowercase,
    username,
    password,
    is_admin
  ) VALUES (
    'e69d6716-f22f-4c60-9cee-f5adb1247965',
    'grogu@gmail.com',
    'grogu@gmail.com',
    'Grogu',
    '$2b$08$ziTBl.Y9ir6ZX22jil3kSuknYgtumgbHbo9Vm/pPJ51VFjDRAuOXS',
    TRUE
  ),
  (
    '1d3dcc2b-24d3-451c-b50d-47ec76dd763c',
    'gideon@gmail.com',
    'gideon@gmail.com',
    'Gideon',
    '$2b$08$ziTBl.Y9ir6ZX22jil3kSuknYgtumgbHbo9Vm/pPJ51VFjDRAuOXS',
    TRUE
  )
`;

async function run() {
  await client.connect();

  await client.query(createYoldiUsersTableQuery);
  await client.query(addAccountsYoldiUsers);

  await client.end();
}

run();
