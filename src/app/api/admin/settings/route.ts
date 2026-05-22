import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/admin-guard'

// 站点设置：任何登录用户都可查看，仅超管可修改
export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: 'asc' },
  })
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const updates = body.settings as Array<{
    key: string
    value: string
    type?: string
    group?: string
    label?: string
  }>
  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: '参数错误' }, { status: 400 })
  }

  for (const u of updates) {
    if (!u.key) continue
    await prisma.siteSetting.upsert({
      where: { key: u.key },
      update: {
        value: u.value ?? '',
        ...(u.type && { type: u.type }),
        ...(u.group && { group: u.group }),
        ...(u.label !== undefined && { label: u.label || null }),
      },
      create: {
        key: u.key,
        value: u.value ?? '',
        type: u.type || 'text',
        group: u.group || 'general',
        label: u.label || null,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
