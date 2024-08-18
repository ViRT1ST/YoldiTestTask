import dotenv from 'dotenv';

dotenv.config();

export const PG_CONFIG = {
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
};

