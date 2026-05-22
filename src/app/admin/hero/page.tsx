'use client'

import { useEffect, useState } from 'react'
import { ImageUploader } from '@/components/image-uploader'

type Slide = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
  sortOrder: number
  active: boolean
}

export default function HeroPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Slide> | null>(null)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/hero').then((r) => r.json())
    setSlides(r.slides || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    if (!editing) return
    if (!editing.imageUrl) {
      alert('请上传背景图')
      return
    }
    const method = editing.id ? 'PUT' : 'POST'
    const url = editing.id ? `/api/admin/hero/${editing.id}` : '/api/admin/hero'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      setEditing(null)
      load()
    }
  }

  async function remove(s: Slide) {
    if (!confirm('确认删除这张轮播图？')) return
    await fetch(`/api/admin/hero/${s.id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <div className="text-white/40">加载中...</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">首页轮播</h1>
          <p className="text-sm text-white/40 mt-1">管理首页的大图轮播（共 {slides.length} 张）</p>
        </div>
        <button
          onClick={() => setEditing({ active: true, sortOrder: slides.length })}
          className="btn-primary"
        >
          + 新增轮播图
        </button>
      </div>

      <div className="space-y-3">
        {slides.length === 0 ? (
          <div className="card text-center py-16 text-white/40">还没有轮播图</div>
        ) : (
          slides.map((s) => (
            <div key={s.id} className="card flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-64 aspect-video rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{s.title || '（无标题）'}</div>
                {s.subtitle && <div className="text-sm text-white/60 mt-1">{s.subtitle}</div>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/40">
                  <span>排序: {s.sortOrder}</span>
                  <span className={s.active ? 'text-green-400' : 'text-white/40'}>
                    {s.active ? '已启用' : '已禁用'}
                  </span>
                  {s.ctaText && <span>按钮: {s.ctaText}</span>}
                </div>
              </div>
              <div className="flex md:flex-col gap-2">
                <button onClick={() => setEditing(s)} className="btn-secondary text-sm">编辑</button>
                <button onClick={() => remove(s)} className="px-4 py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-300 text-sm">删除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑 Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editing.id ? '编辑' : '新增'}轮播图</h3>
            <div className="space-y-4">
              <ImageUploader
                label="背景大图 * (建议 1920×900 或更大)"
                value={editing.imageUrl || ''}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                aspect="wide"
              />
              <div>
                <label className="label">主标题</label>
                <input
                  type="text"
                  className="input"
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="如：源头工厂 · 精工品质"
                />
              </div>
              <div>
                <label className="label">副标题</label>
                <textarea
                  rows={2}
                  className="input resize-y"
                  value={editing.subtitle || ''}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  placeholder="一句辅助说明"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">按钮文字</label>
                  <input
                    type="text"
                    className="input"
                    value={editing.ctaText || ''}
                    onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })}
                    placeholder="如：查看产品"
                  />
                </div>
                <div>
                  <label className="label">按钮链接</label>
                  <input
                    type="text"
                    className="input"
                    value={editing.ctaLink || ''}
                    onChange={(e) => setEditing({ ...editing, ctaLink: e.target.value })}
                    placeholder="/products"
                  />
                </div>
                <div>
                  <label className="label">排序（小的在前）</label>
                  <input
                    type="number"
                    className="input"
                    value={editing.sortOrder ?? 0}
                    onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={editing.active !== false}
                      onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    />
                    <span>启用</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="btn-primary flex-1">保存</button>
                <button onClick={() => setEditing(null)} className="btn-secondary">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
