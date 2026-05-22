'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Case = {
  id: number
  title: string
  carBrand: string | null
  carModel: string | null
  coverImage: string | null
  published: boolean
  featured: boolean
  sortOrder: number
  category: { id: number; name: string; slug: string }
}

type Category = { id: number; name: string; slug: string }

export default function CasesPage() {
  const [items, setItems] = useState<Case[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filterCat, setFilterCat] = useState<string>('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const q = filterCat ? `?categoryId=${filterCat}` : ''
    const [pr, cr] = await Promise.all([
      fetch(`/api/admin/cases${q}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ])
    setItems(pr.cases || [])
    setCategories(cr.categories || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCat])

  async function toggle(c: Case, field: 'published' | 'featured') {
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !c[field] }),
    })
    load()
  }

  async function remove(c: Case) {
    if (!confirm(`确认删除案例「${c.title}」？`)) return
    await fetch(`/api/admin/cases/${c.id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">案例管理</h1>
          <p className="text-sm text-white/40 mt-1">共 {items.length} 个案例</p>
        </div>
        <Link href="/admin/cases/new" className="btn-primary">+ 新增案例</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat('')}
          className={`px-4 py-1.5 rounded-full text-sm ${filterCat === '' ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(String(c.id))}
            className={`px-4 py-1.5 rounded-full text-sm ${filterCat === String(c.id) ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-white/40">加载中...</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-white/40">
            还没有案例，<Link href="/admin/cases/new" className="text-brand-400 hover:underline">点击新增</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-white/40">
                  <th className="p-4 font-medium">封面</th>
                  <th className="p-4 font-medium">案例标题</th>
                  <th className="p-4 font-medium">分类</th>
                  <th className="p-4 font-medium">车型</th>
                  <th className="p-4 font-medium">排序</th>
                  <th className="p-4 font-medium">精选</th>
                  <th className="p-4 font-medium">状态</th>
                  <th className="p-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded bg-white/5 overflow-hidden">
                        {c.coverImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.coverImage} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{c.title}</td>
                    <td className="p-4 text-white/60">{c.category.name}</td>
                    <td className="p-4 text-white/60">
                      {[c.carBrand, c.carModel].filter(Boolean).join(' ') || '-'}
                    </td>
                    <td className="p-4 text-white/60">{c.sortOrder}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggle(c, 'featured')}
                        className={`px-2 py-1 rounded text-xs ${c.featured ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-white/40'}`}
                      >
                        {c.featured ? '⭐ 已精选' : '加精选'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggle(c, 'published')}
                        className={`px-2.5 py-1 rounded text-xs ${c.published ? 'bg-green-500/15 text-green-300' : 'bg-white/10 text-white/50'}`}
                      >
                        {c.published ? '已发布' : '未发布'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/cases/${c.id}`} className="text-brand-400 hover:underline">编辑</Link>
                      <button onClick={() => remove(c)} className="text-red-400 hover:underline">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
