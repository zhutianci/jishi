import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/admin-guard'
import { slugify } from '@/lib/utils'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true, cases: true } },
    },
  })
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const name: string = body.name
  if (!name) return NextResponse.json({ error: '分类名称必填' }, { status: 400 })

  // 生成唯一 slug
  let baseSlug = body.slug ? slugify(body.slug) : slugify(name)
  if (!baseSlug) baseSlug = `cat-${Date.now()}`
  let slug = baseSlug
  let n = 1
  while (await prisma.category.findUnique({ where: { slug } })) {
    n += 1
    slug = `${baseSlug}-${n}`
  }

  const created = await prisma.category.create({
    data: {
      slug,
      name,
      subtitle: body.subtitle || null,
      icon: body.icon || null,
      coverUrl: body.coverUrl || null,
      sortOrder: body.sortOrder ?? 0,
    },
  })
  return NextResponse.json({ category: created })
}
