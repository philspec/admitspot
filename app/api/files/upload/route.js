import { NextResponse } from 'next/server'
import { parseCSV, parseExcel } from '@/lib/utils/fileHandling'
import { authenticateToken } from '@/lib/auth/jwt.js'
import { MAX_FILE_SIZE } from '@/config/constants'

export async function POST(request) {
  try {
    const userId = await authenticateToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the limit' }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const fileName = file.name.toLowerCase()

    let contacts
    if (fileName.endsWith('.csv')) {
      contacts = await parseCSV(fileBuffer)
    } else if (fileName.endsWith('.xlsx')) {
      contacts = await parseExcel(fileBuffer)
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 })
    }

    // Process and save contacts to the database
    // This part would be similar to the batch creation in /api/contacts/batch/route.js

    return NextResponse.json({ message: 'File processed successfully', contactsCount: contacts.length })
  } catch (error) {
    console.error('Error processing file upload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}