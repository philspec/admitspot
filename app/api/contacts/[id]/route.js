import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { validateContact } from '@/lib/validation/schemas'
import { authenticateToken } from '@/lib/auth/jwt.js'

export async function GET(request, { params }) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const result = await sql`SELECT * FROM contacts WHERE id = ${id} AND user_id = ${userId}`

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { error } = validateContact(body)
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { name, email, phone, address, timezone } = body

    const result = await sql`
      UPDATE contacts
      SET name = ${name}, email = ${email}, phone = ${phone}, address = ${address}, timezone = ${timezone}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const result = await sql`
      UPDATE contacts
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}