import { NextResponse } from 'next/server'
import { getCurrentSession, type SessionPayload } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function requireAuth(): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  const session = await getCurrentSession()
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: '未登录' }, { status: 401 }) }
  }
  return { ok: true, session }
}

export async function requireAdmin(): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  const result = await requireAuth()
  if (!result.ok) return result
  if (result.session.role !== 'ADMIN') {
    return { ok: false, response: NextResponse.json({ error: '权限不足' }, { status: 403 }) }
  }
  return result
}

/** 检查会话是否能管理指定 categoryId 的内容 */
export async function canSessionManageCategoryId(
  session: SessionPayload,
  categoryId: number
): Promise<boolean> {
  if (session.role === 'ADMIN') return true
  const cat = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!cat) return false
  if (session.role === 'FLOORMAT_MGR' && cat.slug === 'floormat') return true
  if (session.role === 'WHEELCOVER_MGR' && cat.slug === 'wheelcover') return true
  return false
}

/** 返回当前角色可见的 categoryId 列表（用于列表过滤） */
export async function visibleCategoryIds(session: SessionPayload): Promise<number[] | null> {
  if (session.role === 'ADMIN') return null // null = 全部可见
  const slugMap: Record<string, string> = {
    FLOORMAT_MGR: 'floormat',
    WHEELCOVER_MGR: 'wheelcover',
  }
  const slug = slugMap[session.role]
  if (!slug) return []
  const cats = await prisma.category.findMany({ where: { slug }, select: { id: true } })
  return cats.map((c) => c.id)
}
