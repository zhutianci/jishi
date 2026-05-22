import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

// 分类不允许新增/删除（业务上固定为脚垫+方向盘套），仅允许超管修改名称/封面/排序
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const updated = await prisma.category.update({
    where: { id: parseInt(params.id) },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle || null }),
      ...(body.icon !== undefined && { icon: body.icon || null }),
      ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl || null }),
      ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) || 0 }),
    },
  })
  return NextResponse.json({ category: updated })
}
