import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result.rows[0];

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateToken(user.id);
    console.log("Generated token:", token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}