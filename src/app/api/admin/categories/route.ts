import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/admin-guard'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ categories })
}
