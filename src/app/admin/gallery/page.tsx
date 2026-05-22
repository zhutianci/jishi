'use client'

import { useEffect, useState } from 'react'
import { ImageUploader } from '@/components/image-uploader'

type GImage = {
  id: number
  category: string
  title: string | null
  imageUrl: string
  sortOrder: number
}

const CATEGORIES = [
  { value: 'factory', label: '工厂车间' },
  { value: 'craft', label: '工艺细节' },
  { value: 'team', label: '团队风采' },
  { value: 'certificate', label: '资质证书' },
]

export default function GalleryPage() {
  const [images, setImages] = useState<GImage[]>([])
  const [activeCategory, setActiveCategory] = useState('factory')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<GImage> | null>(null)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/gallery').then((r) => r.json())
    setImages(r.images || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    if (!editing) return
    if (!editing.imageUrl) {
      alert('请上传图片')
      return
    }
    const method = editing.id ? 'PUT' : 'POST'
    const url = editing.id ? `/api/admin/gallery/${editing.id}` : '/api/admin/gallery'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, category: editing.category || activeCategory }),
    })
    if (res.ok) {
      setEditing(null)
      load()
    }
  }

  async function remove(img: GImage) {
    if (!confirm('确认删除？')) return
    await fetch(`/api/admin/gallery/${img.id}`, { method: 'DELETE' })
    load()
  }

  const filtered = images.filter((i) => i.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">相册管理</h1>
          <p className="text-sm text-gray-500 mt-1">工厂、工艺、团队、证书等图片素材</p>
        </div>
        <button
          onClick={() => setEditing({ category: activeCategory, sortOrder: filtered.length })}
          className="btn-primary"
        >
          + 添加图片
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeCategory === c.value
                ? 'border-brand-500 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {c.label}
            <span className="ml-2 text-xs text-gray-400">
              {images.filter((i) => i.category === c.value).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">该分类还没有图片</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="card !p-0 overflow-hidden group">
              <div className="aspect-square bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm truncate">{img.title || '(无标题)'}</div>
                <div className="text-xs text-gray-500 mt-1">排序: {img.sortOrder}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setEditing(img)} className="flex-1 text-xs py-1 rounded bg-gray-100 hover:bg-gray-200">编辑</button>
                  <button onClick={() => remove(img)} className="flex-1 text-xs py-1 rounded bg-red-100 hover:bg-red-200 text-red-600">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editing.id ? '编辑' : '添加'}图片</h3>
            <div className="space-y-4">
              <ImageUploader
                label="图片 *"
                value={editing.imageUrl || ''}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                aspect="square"
              />
              <div>
                <label className="label">分类</label>
                <select
                  className="input"
                  value={editing.category || activeCategory}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">标题（可选）</label>
                <input
                  type="text"
                  className="input"
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label">排序</label>
                <input
                  type="number"
                  className="input"
                  value={editing.sortOrder ?? 0}
                  onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                />
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
