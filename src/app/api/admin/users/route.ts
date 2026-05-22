import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { email, password, name, role } = body
  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: '所有字段必填' }, { status: 400 })
  }
  if (!['ADMIN', 'FLOORMAT_MGR', 'WHEELCOVER_MGR'].includes(role)) {
    return NextResponse.json({ error: '角色无效' }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  if (exists) return NextResponse.json({ error: '邮箱已存在' }, { status: 400 })

  const created = await prisma.user.create({
    data: {
      email: String(email).toLowerCase().trim(),
      passwordHash: await hashPassword(String(password)),
      name,
      role,
      active: body.active !== false,
    },
    select: { id: true, email: true, name: true, role: true, active: true },
  })
  return NextResponse.json({ user: created })
}
