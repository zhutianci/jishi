import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '灌云吉狮汽车饰品有限公司',
    template: '%s | 灌云吉狮汽车饰品',
  },
  description: '专业生产汽车脚垫、手缝方向盘套。源头工厂，品质保证。',
  keywords: ['汽车脚垫', '手缝方向盘套', '汽车饰品', '灌云吉狮', '汽车内饰'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  )
}
