'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Slide = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
}

export function HeroSection({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0)
  const total = slides.length

  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 7000)
    return () => clearInterval(t)
  }, [total])

  if (total === 0) return null
  const current = slides[idx]
  const hasImage = !!current.imageUrl

  return (
    <section className="relative h-[88vh] min-h-[560px] md:h-screen md:min-h-[640px] max-h-[960px] overflow-hidden text-bone-50">
      {/* 背景 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ink-700 via-brand-900 to-ink-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 蒙版：底部强渐变保证文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-ink-900/40" />
      {/* 噪点 */}
      <div className="absolute inset-0 bg-noise opacity-[0.18] mix-blend-overlay pointer-events-none" />

      {/* 顶部刻度线 */}
      <div className="absolute top-0 inset-x-0 h-px bg-bone-50/10" />

      {/* 左侧 vertical label */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center gap-3 text-[10px] uppercase tracking-widest text-bone-50/60 font-mono">
        <span className="inline-block w-8 h-px bg-bone-50/40" />
        Guanyun · Jiangsu · Since 2020
      </div>

      {/* 右侧编号 */}
      <div className="absolute top-6 md:top-10 right-5 md:right-10 font-mono text-[10px] md:text-xs tracking-widest text-bone-50/60">
        {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* 内容：底部对齐 */}
      <div className="relative h-full flex items-end pb-20 md:pb-32">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              {/* 小眼标签 */}
              <div className="flex items-center gap-3 text-[10px] md:text-xs uppercase tracking-widest text-brand-300 mb-5 md:mb-8 font-mono">
                <span className="inline-block w-8 h-px bg-brand-400" />
                灌云吉狮 · 汽车饰品工坊
              </div>

              {/* 大标题（衬线） */}
              {current.title && (
                <h1 className="font-serif font-medium text-[2.6rem] sm:text-6xl md:text-8xl lg:text-9xl leading-[1.02] tracking-[-0.03em] text-bone-50 text-balance">
                  {current.title}
                </h1>
              )}

              {/* 副标题 */}
              {current.subtitle && (
                <p className="mt-6 md:mt-10 max-w-xl text-base sm:text-lg md:text-xl text-bone-100/85 leading-relaxed">
                  {current.subtitle}
                </p>
              )}

              {/* CTA + 滚动提示 */}
              <div className="mt-8 md:mt-12 flex items-center gap-6">
                {current.ctaText && current.ctaLink && (
                  <Link
                    href={current.ctaLink}
                    className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 bg-bone-50 text-ink-900 text-sm font-medium hover:bg-brand-400 hover:text-bone-50 transition-all duration-500 hover:gap-4"
                  >
                    {current.ctaText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 底部刻度尺：左指示器 + 右滚动提示 */}
      <div className="absolute bottom-0 inset-x-0 border-t border-bone-50/10">
        <div className="container flex items-center justify-between py-4 md:py-5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-bone-50/70">
          {/* 轮播指示器 */}
          {total > 1 ? (
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-px transition-all duration-500 ${i === idx ? 'w-10 md:w-14 bg-bone-50' : 'w-5 md:w-7 bg-bone-50/30 hover:bg-bone-50/60'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <span>Scroll · 探索</span>
          )}
          <span className="hidden sm:inline-flex items-center gap-2">
            滚动浏览
            <span className="inline-block w-px h-3 bg-bone-50/60 animate-pulse" />
          </span>
        </div>
      </div>
    </section>
  )
}
