'use client'

import { useState } from 'react'
import type { SiteSettingsMap } from '@/lib/settings'

type Props = {
  settings: SiteSettingsMap
  prefix: string
  productLine: string
  productLabel?: string
}

export function ContactBlock({ settings, prefix, productLine, productLabel }: Props) {
  const [qrOpen, setQrOpen] = useState(false)
  const name = settings[`${prefix}.name`] || ''
  const phone = settings[`${prefix}.phone`] || ''
  const wechat = settings[`${prefix}.wechat`] || ''
  const qr = settings[`${prefix}.wechatQr`] || ''

  return (
    <>
      <div className="flex flex-col">
        <div className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-6">
          {productLabel || `${productLine} 业务`}
        </div>

        <h3 className="font-serif text-4xl md:text-5xl text-ink-900 mb-2">
          {name || '负责人'}
        </h3>
        <div className="text-sm text-ink-400 mb-8">{productLine}业务专员</div>

        <div className="space-y-4 mb-8">
          {phone && (
            <div className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 text-xs font-mono uppercase tracking-widest text-ink-400">电话</span>
              <a href={`tel:${phone}`} className="text-link text-lg text-ink-800">{phone}</a>
            </div>
          )}
          {wechat && (
            <div className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 text-xs font-mono uppercase tracking-widest text-ink-400">微信</span>
              <span className="text-lg text-ink-800">{wechat}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {qr && (
            <button onClick={() => setQrOpen(true)} className="btn-primary text-sm">
              扫码加微信
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="btn-secondary text-sm">拨打电话</a>
          )}
        </div>

        {!phone && !qr && (
          <p className="text-sm text-ink-400 italic">联系方式尚未在后台配置</p>
        )}
      </div>

      {qrOpen && qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm" onClick={() => setQrOpen(false)}>
          <div className="bg-bone-50 p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-2">微信 · WeChat</div>
            <h3 className="font-serif text-2xl text-ink-900 mb-1">{name}</h3>
            <p className="text-sm text-ink-400 mb-6">长按二维码识别 / 扫一扫</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="微信二维码" className="w-full" />
            {wechat && (
              <p className="mt-6 text-sm text-ink-700">微信号 <span className="font-medium">{wechat}</span></p>
            )}
            <button onClick={() => setQrOpen(false)} className="mt-6 text-xs font-mono uppercase tracking-widest text-ink-400 hover:text-ink-900">关闭</button>
          </div>
        </div>
      )}
    </>
  )
}
