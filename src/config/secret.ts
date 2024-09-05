// Don't import this file into client components

export const IS_DEV_MODE = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_MODE === 'true';

export const AUTH_CONFIG = {
  secret: process.env.AUTH_SECRET,
  apiPath: '/api/auth'
};

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export const GITHUB_OAUTH_CONFIG = {
  clientId: IS_DEV_MODE
    ? process.env.GITHUB_CLIENT_ID_DEVELOPMENT
    : process.env.GITHUB_CLIENT_ID_PRODUCTION,
  clientSecret: IS_DEV_MODE
    ? process.env.GITHUB_CLIENT_SECRET_DEVELOPMENT
    : process.env.GITHUB_CLIENT_SECRET_PRODUCTION,
};

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

export const PG_LOCAL_CONFIG = {
  host: process.env.PG_LOCAL_HOST,
  port: 5432,
  user: process.env.PG_LOCAL_USER,
  password: process.env.PG_LOCAL_PASSWORD,
  database: process.env.PG_LOCAL_DATABASE,
};
