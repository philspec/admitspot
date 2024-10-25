import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { authenticateToken } from '@/lib/auth/jwt.js'
import { generateCSV } from '@/lib/utils/fileHandling'

export async function GET(request) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await sql`
      SELECT name, email, phone, address, timezone, created_at
      FROM contacts
      WHERE user_id = ${userId} AND deleted_at IS NULL
      ORDER BY name ASC
    `

    const csv = generateCSV(result.rows)

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=contacts.csv',
      },
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}