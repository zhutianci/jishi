import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ slides })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  if (!body.imageUrl) return NextResponse.json({ error: '背景图必填' }, { status: 400 })

  const slide = await prisma.heroSlide.create({
    data: {
      title: body.title || null,
      subtitle: body.subtitle || null,
      imageUrl: body.imageUrl,
      ctaText: body.ctaText || null,
      ctaLink: body.ctaLink || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active !== false,
    },
  })
  return NextResponse.json({ slide })
}
