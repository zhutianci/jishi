'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader, MultiImageUploader } from '@/components/image-uploader'

export type ProductFormData = {
  id?: number
  categoryId: number | ''
  name: string
  material: string
  fitCarModels: string
  shortDesc: string
  description: string
  features: string[]
  coverImage: string
  images: string[]
  published: boolean
  sortOrder: number
}

type Category = { id: number; name: string; slug: string }

export function ProductForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<ProductFormData>({
    categoryId: initial?.categoryId ?? '',
    name: initial?.name ?? '',
    material: initial?.material ?? '',
    fitCarModels: initial?.fitCarModels ?? '',
    shortDesc: initial?.shortDesc ?? '',
    description: initial?.description ?? '',
    features: initial?.features ?? [],
    coverImage: initial?.coverImage ?? '',
    images: initial?.images ?? [],
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [featureDraft, setFeatureDraft] = useState('')

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.categoryId || !data.name) {
      setError('分类和产品名称必填')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
      setSaving(false)
    }
  }

  function addFeature() {
    if (!featureDraft.trim()) return
    setData({ ...data, features: [...data.features, featureDraft.trim()] })
    setFeatureDraft('')
  }

  function removeFeature(i: number) {
    setData({ ...data, features: data.features.filter((_, idx) => idx !== i) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-white/5 pb-3">基本信息</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">所属分类 *</label>
            <select
              required
              className="input"
              value={data.categoryId}
              onChange={(e) => setData({ ...data, categoryId: e.target.value ? parseInt(e.target.value) : '' })}
            >
              <option value="">请选择</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">产品名称 *</label>
            <input
              type="text"
              required
              className="input"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="如：全包围TPE汽车脚垫"
            />
          </div>

          <div>
            <label className="label">材质</label>
            <input
              type="text"
              className="input"
              value={data.material}
              onChange={(e) => setData({ ...data, material: e.target.value })}
              placeholder="如：TPE / 真皮 / 翻毛皮 / 丝圈"
            />
          </div>

          <div>
            <label className="label">适配车型（多个用逗号分隔）</label>
            <input
              type="text"
              className="input"
              value={data.fitCarModels}
              onChange={(e) => setData({ ...data, fitCarModels: e.target.value })}
              placeholder="奥迪A6L, 宝马5系, 奔驰E级"
            />
          </div>
        </div>

        <div>
          <label className="label">简短描述（产品卡片上展示，30 字内最佳）</label>
          <input
            type="text"
            className="input"
            value={data.shortDesc}
            onChange={(e) => setData({ ...data, shortDesc: e.target.value })}
            placeholder="如：360° 全包围设计，加厚耐磨"
          />
        </div>

        <div>
          <label className="label">详细描述</label>
          <textarea
            rows={5}
            className="input resize-y"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="产品的完整介绍，可分段。"
          />
        </div>

        <div>
          <label className="label">产品卖点（最多 5 条）</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input"
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
              placeholder="如：3D立体环绕"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={data.features.length >= 5}
              className="btn-secondary disabled:opacity-50"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.features.map((f, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 text-sm flex items-center gap-2">
                {f}
                <button type="button" onClick={() => removeFeature(i)} className="text-brand-300/60 hover:text-white">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-white/5 pb-3">图片</h3>

        <ImageUploader
          label="主图（列表/卡片展示）"
          value={data.coverImage}
          onChange={(url) => setData({ ...data, coverImage: url })}
          aspect="square"
        />

        <MultiImageUploader
          label="详情图组（详情页轮播）"
          values={data.images}
          onChange={(urls) => setData({ ...data, images: urls })}
          max={15}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-white/5 pb-3">发布设置</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={data.published}
              onChange={(e) => setData({ ...data, published: e.target.checked })}
            />
            <span>上架展示（取消勾选则前台不可见）</span>
          </label>

          <div>
            <label className="label">排序（数字越小越靠前）</label>
            <input
              type="number"
              className="input"
              value={data.sortOrder}
              onChange={(e) => setData({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? '保存中...' : '保存产品'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">取消</button>
      </div>
    </form>
  )
}
