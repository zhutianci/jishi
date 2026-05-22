import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, visibleCategoryIds, canSessionManageCategoryId } from '@/lib/admin-guard'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const categoryId = url.searchParams.get('categoryId')

  const visibleIds = await visibleCategoryIds(auth.session)
  const where: Record<string, unknown> = {}
  if (visibleIds !== null) where.categoryId = { in: visibleIds }
  if (categoryId) where.categoryId = parseInt(categoryId)

  const products = await prisma.product.findMany({
    where,
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { categoryId, name } = body
  if (!categoryId || !name) {
    return NextResponse.json({ error: '分类和名称必填' }, { status: 400 })
  }

  const can = await canSessionManageCategoryId(auth.session, parseInt(categoryId))
  if (!can) return NextResponse.json({ error: '无权管理该分类' }, { status: 403 })

  let baseSlug = body.slug ? slugify(body.slug) : slugify(name)
  if (!baseSlug) baseSlug = `product-${Date.now()}`
  let slug = baseSlug
  let n = 1
  while (await prisma.product.findUnique({ where: { slug } })) {
    n += 1
    slug = `${baseSlug}-${n}`
  }

  const product = await prisma.product.create({
    data: {
      categoryId: parseInt(categoryId),
      name,
      slug,
      material: body.material || null,
      fitCarModels: body.fitCarModels || null,
      shortDesc: body.shortDesc || null,
      description: body.description || null,
      features: body.features || null,
      coverImage: body.coverImage || null,
      images: body.images || null,
      published: body.published !== false,
      sortOrder: body.sortOrder ?? 0,
    },
  })
  return NextResponse.json({ product })
}
