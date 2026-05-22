import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, canSessionManageCategoryId } from '@/lib/admin-guard'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const item = await prisma.case.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  })
  if (!item) return NextResponse.json({ error: '不存在' }, { status: 404 })

  const can = await canSessionManageCategoryId(auth.session, item.categoryId)
  if (!can) return NextResponse.json({ error: '无权查看' }, { status: 403 })

  return NextResponse.json({ case: item })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const item = await prisma.case.findUnique({ where: { id: parseInt(params.id) } })
  if (!item) return NextResponse.json({ error: '不存在' }, { status: 404 })

  const can = await canSessionManageCategoryId(auth.session, item.categoryId)
  if (!can) return NextResponse.json({ error: '无权修改' }, { status: 403 })

  const body = await req.json()
  if (body.categoryId && body.categoryId !== item.categoryId) {
    const canNew = await canSessionManageCategoryId(auth.session, parseInt(body.categoryId))
    if (!canNew) return NextResponse.json({ error: '无权修改到该分类' }, { status: 403 })
  }

  const updated = await prisma.case.update({
    where: { id: item.id },
    data: {
      ...(body.categoryId && { categoryId: parseInt(body.categoryId) }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.carBrand !== undefined && { carBrand: body.carBrand || null }),
      ...(body.carModel !== undefined && { carModel: body.carModel || null }),
      ...(body.customerFeedback !== undefined && { customerFeedback: body.customerFeedback || null }),
      ...(body.description !== undefined && { description: body.description || null }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
      ...(body.images !== undefined && { images: body.images || null }),
      ...(body.completedAt !== undefined && { completedAt: body.completedAt ? new Date(body.completedAt) : null }),
      ...(body.published !== undefined && { published: !!body.published }),
      ...(body.featured !== undefined && { featured: !!body.featured }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
    },
  })
  return NextResponse.json({ case: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const item = await prisma.case.findUnique({ where: { id: parseInt(params.id) } })
  if (!item) return NextResponse.json({ ok: true })

  const can = await canSessionManageCategoryId(auth.session, item.categoryId)
  if (!can) return NextResponse.json({ error: '无权删除' }, { status: 403 })

  await prisma.case.delete({ where: { id: item.id } })
  return NextResponse.json({ ok: true })
}
