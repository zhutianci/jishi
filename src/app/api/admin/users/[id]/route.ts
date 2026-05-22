import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { hashPassword } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const id = parseInt(params.id)
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })

  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = body.name
  if (body.role !== undefined) {
    if (!['ADMIN', 'FLOORMAT_MGR', 'WHEELCOVER_MGR'].includes(body.role)) {
      return NextResponse.json({ error: '角色无效' }, { status: 400 })
    }
    data.role = body.role
  }
  if (body.active !== undefined) data.active = !!body.active
  if (body.password) {
    if (String(body.password).length < 6) {
      return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 })
    }
    data.passwordHash = await hashPassword(String(body.password))
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, active: true },
  })
  return NextResponse.json({ user: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const id = parseInt(params.id)
  if (id === auth.session.uid) {
    return NextResponse.json({ error: '不能删除自己' }, { status: 400 })
  }

  // 至少保留一个 ADMIN
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ ok: true })
  if (target.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN', active: true } })
    if (adminCount <= 1) {
      return NextResponse.json({ error: '至少保留一个超管' }, { status: 400 })
    }
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
