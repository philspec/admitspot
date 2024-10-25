import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const userId = request.headers.get('X-User-ID');
    console.log("Received request to create contact for user:", userId);

    if (!userId) {
      console.log("No user ID found in request headers");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, address, timezone } = await request.json();
    console.log("Received contact data:", { name, email, phone, address, timezone });

    const result = await sql`
      INSERT INTO contacts (user_id, name, email, phone, address, timezone)
      VALUES (${userId}, ${name}, ${email}, ${phone}, ${address}, ${timezone})
      RETURNING id, name, email, phone, address, timezone
    `;

    console.log("Contact created:", result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}