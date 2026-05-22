import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'jishi_session'

async function verify(token: string, secret: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 仅保护 /admin 路径
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // 登录页本身不拦截
  if (pathname === '/admin/login') return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  const secret = process.env.JWT_SECRET || ''

  if (!token || !(await verify(token, secret))) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
