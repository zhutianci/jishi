import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, canSessionManageCategoryId } from '@/lib/admin-guard'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  })
  if (!product) return NextResponse.json({ error: '不存在' }, { status: 404 })

  const can = await canSessionManageCategoryId(auth.session, product.categoryId)
  if (!can) return NextResponse.json({ error: '无权查看' }, { status: 403 })

  return NextResponse.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const product = await prisma.product.findUnique({ where: { id: parseInt(params.id) } })
  if (!product) return NextResponse.json({ error: '不存在' }, { status: 404 })

  const can = await canSessionManageCategoryId(auth.session, product.categoryId)
  if (!can) return NextResponse.json({ error: '无权修改' }, { status: 403 })

  const body = await req.json()
  // 如果尝试切换分类，需要新分类也有权限
  if (body.categoryId && body.categoryId !== product.categoryId) {
    const canNew = await canSessionManageCategoryId(auth.session, parseInt(body.categoryId))
    if (!canNew) return NextResponse.json({ error: '无权修改到该分类' }, { status: 403 })
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      ...(body.categoryId && { categoryId: parseInt(body.categoryId) }),
      ...(body.name !== undefined && { name: body.name }),
      ...(body.priceText !== undefined && { priceText: body.priceText || null }),
      ...(body.material !== undefined && { material: body.material || null }),
      ...(body.fitCarModels !== undefined && { fitCarModels: body.fitCarModels || null }),
      ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc || null }),
      ...(body.description !== undefined && { description: body.description || null }),
      ...(body.features !== undefined && { features: body.features || null }),
      ...(body.specs !== undefined && { specs: body.specs || null }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
      ...(body.images !== undefined && { images: body.images || null }),
      ...(body.published !== undefined && { published: !!body.published }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
    },
  })
  return NextResponse.json({ product: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const product = await prisma.product.findUnique({ where: { id: parseInt(params.id) } })
  if (!product) return NextResponse.json({ ok: true })

  const can = await canSessionManageCategoryId(auth.session, product.categoryId)
  if (!can) return NextResponse.json({ error: '无权删除' }, { status: 403 })

  await prisma.product.delete({ where: { id: product.id } })
  return NextResponse.json({ ok: true })
}
