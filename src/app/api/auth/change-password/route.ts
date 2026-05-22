import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentSession, verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { oldPassword, newPassword } = await req.json()
  if (!oldPassword || !newPassword || String(newPassword).length < 6) {
    return NextResponse.json({ error: '新密码至少 6 位' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.uid } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })

  const ok = await verifyPassword(String(oldPassword), user.passwordHash)
  if (!ok) return NextResponse.json({ error: '原密码错误' }, { status: 401 })

  const newHash = await hashPassword(String(newPassword))
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  })

  return NextResponse.json({ ok: true })
}
