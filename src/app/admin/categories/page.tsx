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
  contactKey: string | null
  _count?: { products: number; cases: number }
}

const PROTECTED_SLUGS = ['floormat', 'wheelcover']

const CONTACT_OPTIONS = [
  { value: '', label: '（自动判断 — 推荐）' },
  { value: 'huangwei', label: '黄威（脚垫业务）' },
  { value: 'zhusuting', label: '朱苏婷（方向盘套业务）' },
]

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [savedId, setSavedId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)

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
    } else {
      const e = await res.json()
      alert(e.error || '保存失败')
    }
  }

  async function remove(cat: Category) {
    if (PROTECTED_SLUGS.includes(cat.slug)) {
      alert('系统保留分类不可删除')
      return
    }
    if (!confirm(`确认删除分类「${cat.name}」？\n（仅当该分类下没有任何产品和案例时才能删除）`)) return
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const e = await res.json()
      alert(e.error || '删除失败')
      return
    }
    load()
  }

  async function createNew() {
    if (!editing?.name || !editing?.slug) {
      alert('名称和 slug 必填')
      return
    }
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      setEditing(null)
      load()
    } else {
      const e = await res.json()
      alert(e.error || '创建失败')
    }
  }

  function update(id: number, patch: Partial<Category>) {
    setCats(cats.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  if (loading) return <div className="text-gray-500">加载中...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">分类设置</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理产品分类。<span className="text-amber-700">floormat / wheelcover</span> 为系统保留分类（与脚垫/方向盘套负责人权限绑定），不可删除
          </p>
        </div>
        <button
          onClick={() => setEditing({ sortOrder: cats.length, slug: '', name: '' })}
          className="btn-primary"
        >
          + 新增分类
        </button>
      </div>

      {cats.map((c) => {
        const isProtected = PROTECTED_SLUGS.includes(c.slug)
        return (
          <div key={c.id} className="card space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500 font-mono">{c.slug}</span>
                <h3 className="font-semibold">{c.name}</h3>
                {isProtected && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs">系统保留</span>
                )}
                {c._count && (
                  <span className="text-xs text-gray-500">
                    {c._count.products} 产品 · {c._count.cases} 案例
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {savedId === c.id && <span className="text-xs text-green-700">已保存</span>}
                <button onClick={() => save(c)} disabled={savingId === c.id} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
                  {savingId === c.id ? '保存中...' : '保存'}
                </button>
                {!isProtected && (
                  <button
                    onClick={() => remove(c)}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    删除
                  </button>
                )}
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

            {!isProtected && (
              <div>
                <label className="label">
                  Slug（URL 标识，只能字母数字中划线）
                  <span className="ml-2 text-xs text-gray-400">用于生成 /products?cat=<b>{c.slug}</b></span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={c.slug}
                  onChange={(e) => update(c.id, { slug: e.target.value })}
                />
              </div>
            )}

            <ImageUploader
              label="分类封面图（用于产品中心列表入口）"
              value={c.coverUrl || ''}
              onChange={(url) => update(c.id, { coverUrl: url })}
              aspect="video"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">对接联系人</label>
                <select
                  className="input"
                  value={c.contactKey || ''}
                  onChange={(e) => update(c.id, { contactKey: e.target.value })}
                >
                  {CONTACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  控制产品/案例详情页显示哪个联系人。留空时按 slug/名字自动判断
                </p>
              </div>
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
          </div>
        )
      })}

      {/* 新增弹窗 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">新增分类</h3>
            <div className="space-y-4">
              <div>
                <label className="label">分类名称 *</label>
                <input
                  type="text"
                  className="input"
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="如：座椅套"
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Slug *（URL 标识，建议英文）</label>
                <input
                  type="text"
                  className="input font-mono"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="seatcover"
                />
                <p className="text-xs text-gray-400 mt-1">用于 URL：/products?cat={editing.slug || 'xxx'}</p>
              </div>
              <div>
                <label className="label">副标题（可选）</label>
                <input
                  type="text"
                  className="input"
                  value={editing.subtitle || ''}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
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
              <ImageUploader
                label="封面图（可选）"
                value={editing.coverUrl || ''}
                onChange={(url) => setEditing({ ...editing, coverUrl: url })}
                aspect="video"
              />
              <div>
                <label className="label">对接联系人 *</label>
                <select
                  className="input"
                  value={editing.contactKey || ''}
                  onChange={(e) => setEditing({ ...editing, contactKey: e.target.value })}
                >
                  {CONTACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                💡 新增的分类只有<b>超级管理员</b>能管理产品和案例（脚垫/方向盘套负责人仅能管理对应原有分类）
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={createNew} className="btn-primary flex-1">创建</button>
                <button onClick={() => setEditing(null)} className="btn-secondary">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
