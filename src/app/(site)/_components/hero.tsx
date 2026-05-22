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
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000)
    return () => clearInterval(t)
  }, [total])

  if (total === 0) return null
  const current = slides[idx]

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* 背景图 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {current.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ink-900 via-brand-900/20 to-ink-950" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/70" />
      <div className="absolute inset-0 bg-hero-grain" />

      {/* 内容 */}
      <div className="relative h-full flex items-center">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-3xl"
            >
              {current.title && (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
                  {current.title}
                </h1>
              )}
              {current.subtitle && (
                <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed">
                  {current.subtitle}
                </p>
              )}
              {current.ctaText && current.ctaLink && (
                <Link href={current.ctaLink} className="btn-primary text-base">
                  {current.ctaText} →
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 指示器 */}
      {total > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all ${i === idx ? 'w-12 bg-brand-400' : 'w-6 bg-white/30 hover:bg-white/50'}`}
              aria-label={`轮播 ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* 滚动提示 */}
      <div className="absolute bottom-4 right-8 hidden md:flex flex-col items-center gap-2 text-white/40 text-xs">
        <span>下滑探索</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
