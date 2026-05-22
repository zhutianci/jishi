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
  const hasImage = !!current.imageUrl

  return (
    // 移动端高度更紧凑（不再吞屏一整屏，便于看到下方内容），桌面端保持沉浸式
    <section className="relative h-[70vh] min-h-[460px] max-h-[640px] md:h-screen md:min-h-[600px] md:max-h-[900px] overflow-hidden text-white">
      {/* 背景 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt=""
              // object-cover 在手机上会裁掉很多；用 object-position center 居中裁剪
              // 由于手机屏幕窄高，hero 高度也降低，图片裁切就不那么夸张了
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-800 via-brand-900 to-stone-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 暗色蒙版 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      {/* 内容：移动端从底部偏上开始（与暗蒙版深处对齐，可读性好） */}
      <div className="relative h-full flex items-end md:items-center pb-16 md:pb-0">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-3xl"
            >
              {current.title && (
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-3 md:mb-6 text-white drop-shadow">
                  {current.title}
                </h1>
              )}
              {current.subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-white/85 mb-5 md:mb-8 max-w-2xl leading-relaxed drop-shadow line-clamp-3">
                  {current.subtitle}
                </p>
              )}
              {current.ctaText && current.ctaLink && (
                <Link href={current.ctaLink} className="btn-primary text-sm md:text-base">
                  {current.ctaText} →
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 指示器 */}
      {total > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all ${i === idx ? 'w-10 md:w-12 bg-white' : 'w-5 md:w-6 bg-white/40 hover:bg-white/70'}`}
              aria-label={`轮播 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
