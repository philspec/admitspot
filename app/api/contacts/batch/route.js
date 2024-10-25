import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { validateContacts } from '@/lib/validation/schemas'
import { authenticateToken } from '@/lib/auth/jwt.js'

export async function POST(request) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { error } = validateContacts(body)
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { contacts } = body

    const result = await sql.begin(async (sql) => {
      const insertedContacts = []
      for (const contact of contacts) {
        const { name, email, phone, address, timezone } = contact
        const res = await sql`
          INSERT INTO contacts (user_id, name, email, phone, address, timezone)
          VALUES (${userId}, ${name}, ${email}, ${phone}, ${address}, ${timezone})
          RETURNING *
        `
        insertedContacts.push(res.rows[0])
      }
      return insertedContacts
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error in batch contact creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}