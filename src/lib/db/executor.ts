import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

import { IS_DEV_MODE, PG_DEV_CONFIG } from '@/constants/secret';

let pool = IS_DEV_MODE ? new Pool(PG_DEV_CONFIG) : null;

export default async function executeQuery(query: string, params: any[] = []) {
  // creating new pool if not exist
  if (IS_DEV_MODE && !pool) {
    pool = new Pool(PG_DEV_CONFIG);
  } 

  // execute query on local postgresql or on vercel postgresql
  if (IS_DEV_MODE && pool) {
    return pool.query(query, params);
  } else {
    return sql.query(query, params);
  }
}
