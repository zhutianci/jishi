import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signSession, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    })

    if (!user || !user.active) {
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 })
    }

    const ok = await verifyPassword(String(password), user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signSession({
      uid: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'FLOORMAT_MGR' | 'WHEELCOVER_MGR',
      name: user.name,
    })
    await setSessionCookie(token)

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (err) {
    console.error('login error', err)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
