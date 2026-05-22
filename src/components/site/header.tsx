'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SiteSettingsMap } from '@/lib/settings'

const navLinks = [
  { href: '/', label: '首页', en: 'Home' },
  { href: '/products', label: '产品', en: 'Products' },
  { href: '/cases', label: '案例', en: 'Cases' },
  { href: '/craft', label: '工艺', en: 'Craft' },
  { href: '/about', label: '关于', en: 'About' },
  { href: '/contact', label: '联系', en: 'Contact' },
]

export function Header({ settings }: { settings: SiteSettingsMap }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        'fixed top-0 inset-x-0 z-40 transition-all duration-500',
        transparent
          ? 'bg-transparent text-bone-50'
          : 'bg-bone-50/90 backdrop-blur-xl border-b border-ink-100 text-ink-900'
      )}
    >
      {/* 主栏 */}
      <div className="container flex items-center justify-between h-14 md:h-20">
        {/* Logo — 衬线品牌字 */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            吉狮
          </span>
          <span className={cn(
            'hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest',
            transparent ? 'text-bone-50/60' : 'text-ink-400'
          )}>
            {shortName === '吉狮汽饰' ? 'Auto Atelier' : shortName}
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative px-4 py-2 text-sm transition-colors duration-300',
                  transparent
                    ? active ? 'text-bone-50' : 'text-bone-50/70 hover:text-bone-50'
                    : active ? 'text-ink-900' : 'text-ink-400 hover:text-ink-900'
                )}
              >
                <span className="relative">
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px bg-current transition-all duration-500',
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </span>
              </Link>
            )
          })}
        </nav>

        {/* 桌面端右侧 CTA */}
        <Link
          href="/contact"
          className={cn(
            'hidden md:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-500',
            transparent
              ? 'bg-bone-50 text-ink-900 hover:bg-brand-400 hover:text-bone-50 hover:gap-3'
              : 'bg-ink-900 text-bone-50 hover:bg-brand-600 hover:gap-3'
          )}
        >
          预约咨询
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* 移动端右侧：电话图标 */}
        <Link
          href="/contact"
          className={cn(
            'md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors',
            transparent ? 'bg-bone-50/15 text-bone-50' : 'bg-ink-900 text-bone-50'
          )}
          aria-label="联系我们"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
          </svg>
        </Link>
      </div>

      {/* 移动端持久导航条 */}
      <div
        ref={scrollRef}
        className={cn(
          'lg:hidden overflow-x-auto scrollbar-hide border-t',
          transparent ? 'border-bone-50/10' : 'border-ink-100'
        )}
      >
        <nav className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 text-sm whitespace-nowrap transition-all duration-300',
                  transparent
                    ? active
                      ? 'text-bone-50 font-medium'
                      : 'text-bone-50/70'
                    : active
                      ? 'text-ink-900 font-medium'
                      : 'text-ink-400'
                )}
              >
                <span className="relative">
                  {link.label}
                  {active && (
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 right-0 h-px',
                        transparent ? 'bg-bone-50' : 'bg-ink-900'
                      )}
                    />
                  )}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
