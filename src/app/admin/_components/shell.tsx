'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Session = {
  uid: number
  email: string
  role: 'ADMIN' | 'FLOORMAT_MGR' | 'WHEELCOVER_MGR'
  name: string
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: '超级管理员',
  FLOORMAT_MGR: '脚垫负责人',
  WHEELCOVER_MGR: '方向盘套负责人',
}

const navItems = [
  { href: '/admin', label: '仪表盘', icon: '📊', adminOnly: false },
  { href: '/admin/products', label: '产品管理', icon: '🛍️', adminOnly: false },
  { href: '/admin/cases', label: '案例管理', icon: '⭐', adminOnly: false },
  { href: '/admin/hero', label: '首页轮播', icon: '🎬', adminOnly: true },
  { href: '/admin/gallery', label: '相册管理', icon: '🖼️', adminOnly: true },
  { href: '/admin/categories', label: '分类设置', icon: '🏷️', adminOnly: true },
  { href: '/admin/settings', label: '站点设置', icon: '⚙️', adminOnly: true },
  { href: '/admin/users', label: '账号管理', icon: '👥', adminOnly: true },
  { href: '/admin/account', label: '修改密码', icon: '🔑', adminOnly: false },
]

export function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 登录页不应被这个 shell 包裹
  if (pathname === '/admin/login') return <>{children}</>

  const visibleNav = navItems.filter((n) => !n.adminOnly || session.role === 'ADMIN')

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-900 border-r border-white/5 flex flex-col transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold">
              吉
            </div>
            <div>
              <div className="font-semibold">吉狮后台</div>
              <div className="text-xs text-white/40">ji-shi.com</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleNav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="text-sm font-medium">{session.name}</div>
          <div className="text-xs text-white/40 truncate">{session.email}</div>
          <div className="mt-1 text-xs">
            <span className="inline-block px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300">
              {ROLE_LABEL[session.role] || session.role}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 text-xs text-center py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70"
            >
              查看官网
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 text-xs py-1.5 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300"
            >
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <main className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-ink-900/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold">吉狮后台</span>
          <div className="w-9" />
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
