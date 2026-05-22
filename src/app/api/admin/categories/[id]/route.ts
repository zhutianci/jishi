import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { slugify } from '@/lib/utils'

const PROTECTED_SLUGS = new Set(['floormat', 'wheelcover']) // 与角色权限强绑定的固定分类

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const id = parseInt(params.id)
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: '分类不存在' }, { status: 404 })

  // slug 修改需检查唯一性；保留分类的 slug 不允许改（与角色权限绑定）
  let newSlug: string | undefined
  if (body.slug && body.slug !== existing.slug) {
    if (PROTECTED_SLUGS.has(existing.slug)) {
      return NextResponse.json({ error: '该分类的标识为系统保留，不可修改' }, { status: 400 })
    }
    newSlug = slugify(body.slug)
    if (!newSlug) return NextResponse.json({ error: 'slug 无效' }, { status: 400 })
    const dup = await prisma.category.findUnique({ where: { slug: newSlug } })
    if (dup) return NextResponse.json({ error: 'slug 已被占用' }, { status: 400 })
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(newSlug && { slug: newSlug }),
      ...(body.name !== undefined && { name: body.name }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle || null }),
      ...(body.icon !== undefined && { icon: body.icon || null }),
      ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl || null }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
    },
  })
  return NextResponse.json({ category: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const id = parseInt(params.id)
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, cases: true } } },
  })
  if (!existing) return NextResponse.json({ ok: true })

  if (PROTECTED_SLUGS.has(existing.slug)) {
    return NextResponse.json({ error: '系统保留分类不可删除' }, { status: 400 })
  }

  if (existing._count.products > 0 || existing._count.cases > 0) {
    return NextResponse.json(
      { error: `该分类下还有 ${existing._count.products} 个产品、${existing._count.cases} 个案例，请先删除后再操作` },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
