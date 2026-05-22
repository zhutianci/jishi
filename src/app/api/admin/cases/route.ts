import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, visibleCategoryIds, canSessionManageCategoryId } from '@/lib/admin-guard'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const categoryId = url.searchParams.get('categoryId')

  const visibleIds = await visibleCategoryIds(auth.session)
  const where: Record<string, unknown> = {}
  if (visibleIds !== null) where.categoryId = { in: visibleIds }
  if (categoryId) where.categoryId = parseInt(categoryId)

  const cases = await prisma.case.findMany({
    where,
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ cases })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { categoryId, title } = body
  if (!categoryId || !title) {
    return NextResponse.json({ error: '分类和标题必填' }, { status: 400 })
  }

  const can = await canSessionManageCategoryId(auth.session, parseInt(categoryId))
  if (!can) return NextResponse.json({ error: '无权管理该分类' }, { status: 403 })

  const created = await prisma.case.create({
    data: {
      categoryId: parseInt(categoryId),
      title,
      carBrand: body.carBrand || null,
      carModel: body.carModel || null,
      customerFeedback: body.customerFeedback || null,
      description: body.description || null,
      coverImage: body.coverImage || null,
      images: body.images || null,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
      published: body.published !== false,
      featured: !!body.featured,
      sortOrder: body.sortOrder ?? 0,
    },
  })
  return NextResponse.json({ case: created })
}
