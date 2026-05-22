'use client'

import { useState } from 'react'

export function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  if (images.length === 0) {
    return <div className="aspect-square rounded-2xl bg-gray-100 skeleton" />
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-brand-500' : 'border-gray-200 hover:border-white/30'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
