import { cn } from '@/lib/utils'

type Props = {
  number?: string
  children: React.ReactNode
  className?: string
}

/** 章节标签：编号 + 文字。例如 "01 / 产品中心" */
export function SectionLabel({ number, children, className }: Props) {
  return (
    <div className={cn('flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-400', className)}>
      <span className="inline-block w-8 h-px bg-ink-400" />
      {number && <span className="text-ink-700">{number}</span>}
      {number && <span className="text-ink-300">/</span>}
      <span>{children}</span>
    </div>
  )
}
