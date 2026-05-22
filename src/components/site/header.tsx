'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { SiteSettingsMap } from '@/lib/settings'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/products', label: '产品中心' },
  { href: '/cases', label: '案例展示' },
  { href: '/craft', label: '工艺优势' },
  { href: '/contact', label: '联系我们' },
]

export function Header({ settings }: { settings: SiteSettingsMap }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shortName = settings['company.shortName'] || '吉狮汽饰'

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        scrolled ? 'bg-ink-950/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-lg">
            吉
          </div>
          <span className="font-semibold text-lg hidden sm:inline">{shortName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-colors',
                  active ? 'text-white bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden md:inline-flex btn-primary !py-2 !px-5 text-sm">
            联系我们
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            aria-label="菜单"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950 lg:hidden">
          <div className="container py-5 flex items-center justify-between">
            <span className="font-semibold">{shortName}</span>
            <button onClick={() => setMenuOpen(false)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="container py-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
