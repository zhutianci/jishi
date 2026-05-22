import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { url } = await req.json()
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  const filename = url.replace('/uploads/', '')
  // 防路径穿越
  if (filename.includes('/') || filename.includes('..')) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 })
  }

  const filepath = path.join(UPLOAD_DIR, filename)
  try {
    await fs.unlink(filepath)
  } catch {
    // 文件不存在也视为成功
  }
  return NextResponse.json({ ok: true })
}
