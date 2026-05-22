'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  items: ReactNode[]
  className?: string
  speed?: 'normal' | 'slow'
  separator?: ReactNode
}

export function Marquee({ items, className, speed = 'normal', separator }: Props) {
  // 复制两次形成无缝循环
  const sep =
    separator ?? (
      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40 mx-8" />
    )

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn('flex whitespace-nowrap will-change-transform', speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee')}
      >
        {[0, 1].map((round) => (
          <div key={round} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${round}-${i}`} className="flex items-center">
                <span className="inline-flex items-center">{item}</span>
                {sep}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
