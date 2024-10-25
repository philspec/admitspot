import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env.local') });
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: join(rootDir, '.env.development.local') });
}

// Debug info
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL exists:', !!process.env.POSTGRES_URL);
console.log('Looking for env files in:', rootDir);

export const env = {
  POSTGRES_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL, // fallback to DATABASE_URL
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!env.POSTGRES_URL) {
  console.error('Required environment variables are missing:');
  console.error('POSTGRES_URL or DATABASE_URL must be set');
  throw new Error('POSTGRES_URL is not defined in environment variables');
}