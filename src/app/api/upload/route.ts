import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'

// 上传目录：public/uploads（前端可直接通过 /uploads/xxx 访问）
// 在 docker-compose 中挂载为 volume，避免容器重建丢失
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])
const MAX_SIZE = 15 * 1024 * 1024 // 15MB

export async function POST(req: NextRequest) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: '未上传文件' }, { status: 400 })

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: '仅支持 jpg/png/webp/gif' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '文件最大 15MB' }, { status: 400 })
    }

    await ensureDir(UPLOAD_DIR)

    const buffer = Buffer.from(await file.arrayBuffer())

    // 用 sharp 处理：转 webp，限制最大宽度 2400，质量 85
    const processed = await sharp(buffer)
      .rotate() // 自动按 EXIF 旋转
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    const hash = crypto.createHash('md5').update(processed).digest('hex').slice(0, 12)
    const filename = `${Date.now()}-${hash}.webp`
    const filepath = path.join(UPLOAD_DIR, filename)
    await fs.writeFile(filepath, processed)

    return NextResponse.json({
      ok: true,
      url: `/uploads/${filename}`,
      size: processed.length,
    })
  } catch (err) {
    console.error('upload error', err)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
