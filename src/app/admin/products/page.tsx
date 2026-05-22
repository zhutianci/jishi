'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Product = {
  id: number
  name: string
  slug: string
  material: string | null
  coverImage: string | null
  published: boolean
  sortOrder: number
  category: { id: number; name: string; slug: string }
}

type Category = { id: number; name: string; slug: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filterCat, setFilterCat] = useState<string>('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const q = filterCat ? `?categoryId=${filterCat}` : ''
    const [pr, cr] = await Promise.all([
      fetch(`/api/admin/products${q}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ])
    setProducts(pr.products || [])
    setCategories(cr.categories || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCat])

  async function togglePublished(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    })
    load()
  }

  async function remove(p: Product) {
    if (!confirm(`确认删除产品「${p.name}」？此操作不可恢复。`)) return
    await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">产品管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {products.length} 个产品</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ 新增产品</Link>
      </div>

      {/* 筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat('')}
          className={`px-4 py-1.5 rounded-full text-sm ${filterCat === '' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(String(c.id))}
            className={`px-4 py-1.5 rounded-full text-sm ${filterCat === String(c.id) ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">加载中...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            还没有产品，<Link href="/admin/products/new" className="text-brand-600 hover:underline">点击新增</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="p-4 font-medium">封面</th>
                  <th className="p-4 font-medium">产品名称</th>
                  <th className="p-4 font-medium">分类</th>
                  <th className="p-4 font-medium">材质</th>
                  <th className="p-4 font-medium">排序</th>
                  <th className="p-4 font-medium">状态</th>
                  <th className="p-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded bg-gray-100 overflow-hidden">
                        {p.coverImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.category.name}</td>
                    <td className="p-4 text-gray-600">{p.material || '-'}</td>
                    <td className="p-4 text-gray-600">{p.sortOrder}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublished(p)}
                        className={`px-2.5 py-1 rounded text-xs ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                      >
                        {p.published ? '已上架' : '未上架'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/products/${p.id}`} className="text-brand-600 hover:underline">编辑</Link>
                      <button onClick={() => remove(p)} className="text-red-400 hover:underline">删除</button>
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
