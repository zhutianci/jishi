import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const updated = await prisma.galleryImage.update({
    where: { id: parseInt(params.id) },
    data: {
      ...(body.category !== undefined && { category: body.category }),
      ...(body.title !== undefined && { title: body.title || null }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
    },
  })
  return NextResponse.json({ image: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  await prisma.galleryImage.delete({ where: { id: parseInt(params.id) } }).catch(() => {})
  return NextResponse.json({ ok: true })
}
