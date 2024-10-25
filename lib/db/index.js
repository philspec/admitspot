import { sql } from '@vercel/postgres';

export async function query(text, params) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function transaction(callback) {
  try {
    return await sql.begin(callback);
  } catch (error) {
    console.error('Database transaction error:', error);
    throw error;
  }
}