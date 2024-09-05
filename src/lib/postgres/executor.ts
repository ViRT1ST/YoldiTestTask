import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

import { IS_DEV_MODE, PG_LOCAL_CONFIG } from '@/config/secret';

let pool: Pool | null;

// Execute query on local postgresql or on vercel postgresql
export default function executeQuery(query: string, params: any[] = []) {
  if (IS_DEV_MODE) {
    if (!pool) {
      pool = new Pool(PG_LOCAL_CONFIG);
    }
    
    return pool.query(query, params);
  } else {
    return sql.query(query, params);
  }
}

