import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'jishi_session'
const TOKEN_EXP_DAYS = 14

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  uid: number
  email: string
  role: 'ADMIN' | 'FLOORMAT_MGR' | 'WHEELCOVER_MGR'
  name: string
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXP_DAYS}d`)
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_EXP_DAYS * 24 * 60 * 60,
  })
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME)
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifySession(token)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 权限检查：用户能否管理指定分类的产品/案例
 * - ADMIN 可以管理所有
 * - FLOORMAT_MGR 只能管 floormat 分类
 * - WHEELCOVER_MGR 只能管 wheelcover 分类
 */
export function canManageCategory(role: string, categorySlug: string): boolean {
  if (role === 'ADMIN') return true
  if (role === 'FLOORMAT_MGR' && categorySlug === 'floormat') return true
  if (role === 'WHEELCOVER_MGR' && categorySlug === 'wheelcover') return true
  return false
}

export function isAdmin(role: string): boolean {
  return role === 'ADMIN'
}

export const AUTH_COOKIE = COOKIE_NAME
