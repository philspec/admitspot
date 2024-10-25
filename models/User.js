import { sql } from '@vercel/postgres';
import { hashPassword } from '../lib/auth/passwords';

export async function createUser(name, email, password) {
  const hashedPassword = await hashPassword(password);
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email
  `;
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await sql`
    SELECT id, name, email FROM users WHERE id = ${id}
  `;
  return result.rows[0];
}