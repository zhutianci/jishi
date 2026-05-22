'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  value?: string
  onChange: (url: string) => void
  className?: string
  label?: string
  aspect?: 'square' | 'video' | 'wide' | 'auto'
}

export function ImageUploader({ value, onChange, className, label, aspect = 'video' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '上传失败')
      onChange(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: 'min-h-[160px]',
  }[aspect]

  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50/50',
          'hover:border-brand-500/50 transition-colors cursor-pointer',
          aspectClass
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-white text-sm">点击替换</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                className="px-3 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white text-xs"
              >
                移除
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
            {uploading ? (
              <>
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>上传中...</span>
              </>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5v9" />
                </svg>
                <span>点击或拖拽图片上传</span>
                <span className="text-xs text-gray-400">支持 jpg/png/webp · 最大 15MB</span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}

type MultiProps = {
  values: string[]
  onChange: (urls: string[]) => void
  className?: string
  label?: string
  max?: number
}

export function MultiImageUploader({ values, onChange, className, label, max = 12 }: MultiProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setError(null)
    setUploading(true)
    const newUrls: string[] = []
    try {
      for (const file of Array.from(files)) {
        if (values.length + newUrls.length >= max) break
        const form = new FormData()
        form.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: form })
        const data = await res.json()
        if (res.ok) newUrls.push(data.url)
      }
      onChange([...values, ...newUrls])
    } catch (e) {
      setError(e instanceof Error ? e.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...values]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="label !mb-0">{label}</label>
          <span className="text-xs text-gray-500">{values.length} / {max}</span>
        </div>
      )}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-30"
              >
                上移
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs px-2 py-1 rounded bg-red-500/80 hover:bg-red-500"
              >
                删除
              </button>
            </div>
          </div>
        ))}
        {values.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-brand-500/50 flex flex-col items-center justify-center text-gray-500 text-xs gap-1 transition-colors"
            disabled={uploading}
          >
            {uploading ? (
              <span>上传中...</span>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>添加</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
