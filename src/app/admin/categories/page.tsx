'use client'

import { useEffect, useState } from 'react'
import { ImageUploader } from '@/components/image-uploader'

type Category = {
  id: number
  slug: string
  name: string
  subtitle: string | null
  icon: string | null
  coverUrl: string | null
  sortOrder: number
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [savedId, setSavedId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/categories').then((r) => r.json())
    setCats(r.categories || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function save(cat: Category) {
    setSavingId(cat.id)
    setSavedId(null)
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    })
    setSavingId(null)
    if (res.ok) {
      setSavedId(cat.id)
      setTimeout(() => setSavedId(null), 2000)
    }
  }

  function update(id: number, patch: Partial<Category>) {
    setCats(cats.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  if (loading) return <div className="text-white/40">加载中...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">分类设置</h1>
        <p className="text-sm text-white/40 mt-1">编辑产品分类的名称、副标题和封面图</p>
      </div>

      {cats.map((c) => (
        <div key={c.id} className="card space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">{c.slug}</span>
              <h3 className="font-semibold">{c.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              {savedId === c.id && <span className="text-xs text-green-400">已保存</span>}
              <button onClick={() => save(c)} disabled={savingId === c.id} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
                {savingId === c.id ? '保存中...' : '保存'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">显示名称</label>
              <input
                type="text"
                className="input"
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">副标题</label>
              <input
                type="text"
                className="input"
                value={c.subtitle || ''}
                onChange={(e) => update(c.id, { subtitle: e.target.value })}
                placeholder="如：源头工厂 · 全车型适配"
              />
            </div>
          </div>

          <ImageUploader
            label="分类封面图（用于产品中心列表入口）"
            value={c.coverUrl || ''}
            onChange={(url) => update(c.id, { coverUrl: url })}
            aspect="video"
          />

          <div>
            <label className="label">排序</label>
            <input
              type="number"
              className="input max-w-[120px]"
              value={c.sortOrder}
              onChange={(e) => update(c.id, { sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
