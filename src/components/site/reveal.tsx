'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** once 默认 true：进入视口后不再重复 */
  once?: boolean
}

export function Reveal({ children, delay = 0, y = 28, className, once = true }: Props) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 行内文字：从上推入 */
export function RevealText({
  children,
  delay = 0,
  as: As = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p'
  className?: string
}) {
  const reduced = useReducedMotion()
  const Component = motion[As as 'div']

  if (reduced) return <As className={className}>{children}</As>

  return (
    <Component
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
