import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/admin-guard'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const where = category ? { category } : {}

  const images = await prisma.galleryImage.findMany({
    where,
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  })
  return NextResponse.json({ images })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  if (!body.imageUrl || !body.category) {
    return NextResponse.json({ error: '图片和分类必填' }, { status: 400 })
  }

  const created = await prisma.galleryImage.create({
    data: {
      category: body.category,
      title: body.title || null,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder ?? 0,
    },
  })
  return NextResponse.json({ image: created })
}
