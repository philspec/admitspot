import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { sql } from '@vercel/postgres'
import { validateRegistration } from '@/lib/validation/schemas'

export async function POST(request) {
  try {
    const body = await request.json()
    const { error } = validateRegistration(body)
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { name, email, password } = body

    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    const newUser = result.rows[0]

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}