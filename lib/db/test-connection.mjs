// lib/db/migrations.mjs
import { sql } from '@vercel/postgres';
import { env } from '../../config/env.mjs';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL configured:', !!env.POSTGRES_URL);
    
    const result = await sql`SELECT NOW();`;
    console.log('Database connection successful!');
    console.log('Current timestamp:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection().then(success => {
    if (!success) process.exit(1);
  });
}

 testConnection().then(success => {
  if (!success) process.exit(1);
});