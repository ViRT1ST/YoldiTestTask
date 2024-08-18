import { Client } from 'pg';
import { PG_CONFIG } from './config';

const client = new Client(PG_CONFIG);

const createUsersTable = `
  CREATE TABLE users (
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

const addUsers = `
  INSERT INTO users (
    uuid,
    default_auth_provider,
    google_id,
    github_id,
    auth_email,
    auth_password,
    name,
    is_admin
  ) VALUES (
    '539560a8-9f98-46d3-8fb7-7806fec183c1',
    'credentials',
    NULL,
    NULL,
    'grogu@gmail.com',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Din Grogu',
    TRUE
  ), (
    '0871cf8b-908d-43cd-954c-d61848da3ad6',
    'credentials',
    NULL,
    NULL,
    'example@gmail.com',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Владислав',
    FALSE
  ), (
    '8a2627fc-48f1-4c15-8ff9-f07e33798989',
    'google',
    '105837393022960528763',
    NULL,
    NULL,
    NULL,
    'Марина Демченко',
    FALSE
  ), (
    '4fd6466d-fc5d-4103-bd46-4a33025618f3',
    'github',
    NULL,
    '166623076',
    NULL,
    NULL,
    'mademz',
    FALSE
  );
`;

async function run() {
  await client.connect();
  await client.query(createUsersTable);
  await client.query(addUsers);
  await client.end();
}

run();
