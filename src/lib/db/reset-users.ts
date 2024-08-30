import { Client } from 'pg';
import { PG_CONFIG } from './config';

const client = new Client(PG_CONFIG);

const deleteAllUsers = `
  TRUNCATE users;
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
    avatar,
    profile_cover,
    is_admin
  ) VALUES (
    '0871cf8b-908d-43cd-954c-d61848da3ad6',
    'credentials',
    NULL,
    NULL,
    'example@gmail.com',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Владислав',
    'https://res.cloudinary.com/dbgj7kvye/image/upload/v1724307637/portfolio/_vlad_avatar_vctboz.png',
    'https://res.cloudinary.com/dbgj7kvye/image/upload/v1724307638/portfolio/_vlad_cover_dmyxbi.jpg',
    FALSE
  ), (
    '2d358450-5a4c-4ec6-9270-47d628ce33d1',
    'credentials',
    NULL,
    NULL,
    'eugenearbatsky@yandex.ru',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Евгений',
    NULL,
    NULL,
    FALSE
  ), (
    'dd90fbe9-9012-4131-88b5-aa0a3fcdff9e',
    'credentials',
    NULL,
    NULL,
    'andrew1245@gmail.com',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Андрей',
    NULL,
    NULL,
    FALSE
  ), (
    'e918173f-8cdc-4596-936a-42139191a44a',
    'credentials',
    NULL,
    NULL,
    'annadearmas1988@gmail.com',
    '$2a$08$ovF5Xjjw.vqCthA5/OZzVuw0IAiNVhreIpWues.oM47EqNmuLs.3y',
    'Анна',
    'https://res.cloudinary.com/dbgj7kvye/image/upload/v1724396008/portfolio/_anna-de-armas_biubni.jpg',
    NULL,
    FALSE
  ), (
    '69f8e923-9ef0-4001-89db-723ce98b51d2',
    'google',
    '105837393022960528763',
    NULL,
    NULL,
    NULL,
    'Марина',
    'https://lh3.googleusercontent.com/a/ACg8ocINUmBMx4arBV3nor_d4cQdP9tIbabo8TW1WLa0ZFU-42z50w=s512-c',
    NULL,
    FALSE
  ), (
    '4fd6466d-fc5d-4103-bd46-4a33025618f3',
    'github',
    NULL,
    '166623076',
    NULL,
    NULL,
    'MaDemz',
    'https://avatars.githubusercontent.com/u/166623076?v=4',
    NULL,
    FALSE
  );
`;

async function run() {
  await client.connect();
  await client.query(deleteAllUsers);
  await client.query(addUsers);
  await client.end();
}

run();
