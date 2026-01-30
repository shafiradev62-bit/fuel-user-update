import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'backend/.env.local'),
  path.resolve(__dirname, '../.env.local')
];
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './shared/schema.js';

const databaseUrl =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/fuelfriendly';

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });
