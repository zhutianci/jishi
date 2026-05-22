'use client'

import { useState } from 'react'

export function CaseGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  if (images.length === 0) {
    return <div className="aspect-video rounded-2xl bg-bone-100 skeleton" />
  }

  return (
    <>
      <div className="space-y-3">
        <div
          className="aspect-video rounded-2xl overflow-hidden bg-bone-100 cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active]} alt="" className="w-full h-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  i === active ? 'border-brand-500' : 'border-ink-100 hover:border-white/30'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 灯箱 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active]} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  )
}
