import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  slug: string
  name: string
  subtitle: string
  coverUrl: string | null
  count: number
  /** 用于编辑型布局：1 偏左，2 偏右（默认 1） */
  align?: 1 | 2
  /** 编号显示 */
  number?: string
}

export function ProductLineCard({ slug, name, subtitle, coverUrl, count, align = 1, number }: Props) {
  return (
    <Link
      href={`/products?cat=${slug}`}
      className="group block"
    >
      {/* 图片 */}
      <div className={cn('relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-ink-100', align === 2 && 'md:translate-y-12')}>
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-500 to-ink-800" />
        )}
        {/* 噪点 */}
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
        {/* 编号水印 */}
        {number && (
          <span className="absolute top-4 left-4 md:top-6 md:left-6 text-bone-50/80 font-mono text-xs tracking-widest">
            {number}
          </span>
        )}
        {/* count */}
        <span className="absolute top-4 right-4 md:top-6 md:right-6 text-bone-50/80 font-mono text-xs tracking-widest">
          {String(count).padStart(2, '0')} 款
        </span>
      </div>

      {/* 文字 */}
      <div className="mt-5 md:mt-7 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-serif font-medium text-3xl md:text-4xl lg:text-5xl text-ink-900 group-hover:text-brand-600 transition-colors duration-500 tracking-tight">
            {name}
          </h3>
          {subtitle && (
            <p className="mt-3 text-sm md:text-base text-ink-400 max-w-md leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <span className="shrink-0 mt-2 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-ink-200 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-bone-50 transition-all duration-500">
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
