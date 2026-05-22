import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const updated = await prisma.heroSlide.update({
    where: { id: parseInt(params.id) },
    data: {
      ...(body.title !== undefined && { title: body.title || null }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle || null }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText || null }),
      ...(body.ctaLink !== undefined && { ctaLink: body.ctaLink || null }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
      ...(body.active !== undefined && { active: !!body.active }),
    },
  })
  return NextResponse.json({ slide: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  await prisma.heroSlide.delete({ where: { id: parseInt(params.id) } }).catch(() => {})
  return NextResponse.json({ ok: true })
}
