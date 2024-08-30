import { sql } from '@vercel/postgres';
import { Pool} from 'pg';

import { isDevMode, PG_DEV_CONFIG } from '@/constants/secret';

let pool = isDevMode
  ? new Pool(PG_DEV_CONFIG)
  : null;

export async function executeQuery(query: string, params: any[] = []) {
  // creating new pool if it not exist
  if (isDevMode && !pool) {
    pool = new Pool(PG_DEV_CONFIG);
  } 

  if (isDevMode && pool) {
    return await pool.query(query, params);
  } else {
    return await sql.query(query, params);
  }
}


export default executeQuery;
