'use client'

import { useState } from 'react'
import type { SiteSettingsMap } from '@/lib/settings'

type Props = {
  settings: SiteSettingsMap
  prefix: string // contact.huangwei or contact.zhusuting
  productLine: string
}

export function ContactBlock({ settings, prefix, productLine }: Props) {
  const [qrOpen, setQrOpen] = useState(false)
  const name = settings[`${prefix}.name`] || ''
  const phone = settings[`${prefix}.phone`] || ''
  const wechat = settings[`${prefix}.wechat`] || ''
  const qr = settings[`${prefix}.wechatQr`] || ''

  return (
    <>
      <div className="card !p-5 space-y-3">
        <div className="text-sm text-white/60">{productLine}业务联系人</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-lg font-semibold">
            {name?.[0] || '?'}
          </div>
          <div>
            <div className="font-semibold">{name || '负责人'}</div>
            <div className="text-xs text-white/40">{productLine}业务专员</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {phone && (
            <div className="flex items-center gap-2">
              <span className="text-white/40">📞 电话</span>
              <a href={`tel:${phone}`} className="text-brand-300 hover:underline">{phone}</a>
            </div>
          )}
          {wechat && (
            <div className="flex items-center gap-2">
              <span className="text-white/40">💬 微信号</span>
              <span className="text-white/80">{wechat}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {qr && (
            <button onClick={() => setQrOpen(true)} className="btn-primary flex-1 text-sm !py-2.5">
              扫码加微信
            </button>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="btn-secondary flex-1 text-sm !py-2.5">
              拨打电话
            </a>
          )}
        </div>

        {!phone && !qr && (
          <p className="text-xs text-white/30 italic">联系方式尚未在后台配置</p>
        )}
      </div>

      {qrOpen && qr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setQrOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center text-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">{name} 的微信</h3>
            <p className="text-sm text-ink-600 mb-4">长按二维码识别或扫一扫</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="微信二维码" className="w-full rounded-xl" />
            {wechat && <p className="mt-4 text-sm text-ink-600">微信号：<span className="font-semibold">{wechat}</span></p>}
            <button onClick={() => setQrOpen(false)} className="mt-4 px-6 py-2 rounded-full bg-ink-900 text-white">关闭</button>
          </div>
        </div>
      )}
    </>
  )
}
