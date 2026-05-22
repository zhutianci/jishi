'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SiteSettingsMap } from '@/lib/settings'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/products', label: '产品中心' },
  { href: '/cases', label: '案例展示' },
  { href: '/craft', label: '工艺优势' },
  { href: '/about', label: '关于我们' },
  { href: '/contact', label: '联系我们' },
]

export function Header({ settings }: { settings: SiteSettingsMap }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 首页 Hero 在顶部时透明
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 选中项自动滚动到中间（移动端横向滚动条）
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const active = scroller.querySelector('[data-active="true"]') as HTMLElement | null
    if (active) {
      const offset = active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2
      scroller.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
    }
  }, [pathname])

  const shortName = settings['company.shortName'] || '吉狮汽饰'

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        transparent
          ? 'bg-transparent text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200 text-gray-900 shadow-sm'
      )}
    >
      {/* 顶部主栏：Logo + 联系按钮 */}
      <div className="container flex items-center justify-between h-14 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold md:text-lg text-white">
            吉
          </div>
          <span className={cn('font-semibold text-base md:text-lg', transparent && 'drop-shadow')}>
            {shortName}
          </span>
        </Link>

        {/* 桌面端：水平导航在主栏中 */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-colors',
                  transparent
                    ? active
                      ? 'text-white bg-white/15 backdrop-blur-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                    : active
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* 联系按钮（桌面端右侧） */}
        <Link
          href="/contact"
          className="hidden md:inline-flex btn-primary !py-2 !px-4 text-sm"
        >
          联系我们
        </Link>

        {/* 移动端右侧：联系图标按钮 */}
        <Link
          href="/contact"
          className={cn(
            'md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full',
            transparent ? 'bg-white/15 backdrop-blur-sm text-white' : 'bg-brand-50 text-brand-600'
          )}
          aria-label="联系我们"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
          </svg>
        </Link>
      </div>

      {/* 移动端/平板：始终可见的水平滚动导航条 */}
      <div
        ref={scrollRef}
        className={cn(
          'lg:hidden overflow-x-auto scrollbar-hide border-t',
          transparent ? 'border-white/15' : 'border-gray-200'
        )}
      >
        <nav className="flex items-center gap-1 px-3 py-2 min-w-max">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                  transparent
                    ? active
                      ? 'bg-white text-brand-700 font-medium'
                      : 'text-white/90 hover:bg-white/15'
                    : active
                      ? 'bg-brand-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
