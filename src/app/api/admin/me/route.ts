import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'

export async function GET() {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ user: null })
  return NextResponse.json({
    user: { id: session.uid, email: session.email, name: session.name, role: session.role },
  })
}
