'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader, MultiImageUploader } from '@/components/image-uploader'

export type CaseFormData = {
  categoryId: number | ''
  title: string
  carBrand: string
  carModel: string
  customerFeedback: string
  description: string
  coverImage: string
  images: string[]
  completedAt: string
  published: boolean
  featured: boolean
  sortOrder: number
}

type Category = { id: number; name: string; slug: string }

export function CaseForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<CaseFormData>
  onSubmit: (data: CaseFormData) => Promise<void>
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<CaseFormData>({
    categoryId: initial?.categoryId ?? '',
    title: initial?.title ?? '',
    carBrand: initial?.carBrand ?? '',
    carModel: initial?.carModel ?? '',
    customerFeedback: initial?.customerFeedback ?? '',
    description: initial?.description ?? '',
    coverImage: initial?.coverImage ?? '',
    images: initial?.images ?? [],
    completedAt: initial?.completedAt ?? '',
    published: initial?.published ?? true,
    featured: initial?.featured ?? false,
    sortOrder: initial?.sortOrder ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.categoryId || !data.title) {
      setError('分类和案例标题必填')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-gray-100 pb-3">基本信息</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">所属产品线 *</label>
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
            <label className="label">完成时间</label>
            <input
              type="date"
              className="input"
              value={data.completedAt}
              onChange={(e) => setData({ ...data, completedAt: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">案例标题 *</label>
          <input
            type="text"
            required
            className="input"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="如：奥迪A6L 全黑真皮方向盘套定制"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">车品牌</label>
            <input
              type="text"
              className="input"
              value={data.carBrand}
              onChange={(e) => setData({ ...data, carBrand: e.target.value })}
              placeholder="奥迪 / 宝马 / 奔驰..."
            />
          </div>

          <div>
            <label className="label">具体车型</label>
            <input
              type="text"
              className="input"
              value={data.carModel}
              onChange={(e) => setData({ ...data, carModel: e.target.value })}
              placeholder="A6L / 5系 / E级..."
            />
          </div>
        </div>

        <div>
          <label className="label">案例描述</label>
          <textarea
            rows={4}
            className="input resize-y"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="本次定制采用了什么材质、工艺、特别要求等"
          />
        </div>

        <div>
          <label className="label">客户反馈（一段话即可）</label>
          <textarea
            rows={3}
            className="input resize-y"
            value={data.customerFeedback}
            onChange={(e) => setData({ ...data, customerFeedback: e.target.value })}
            placeholder='如："手感和质量都超出预期，朋友看了都问在哪做的。"'
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-gray-100 pb-3">图片</h3>

        <ImageUploader
          label="封面图（列表展示）"
          value={data.coverImage}
          onChange={(url) => setData({ ...data, coverImage: url })}
          aspect="square"
        />

        <MultiImageUploader
          label="案例图组（多张实拍图，越多越好）"
          values={data.images}
          onChange={(urls) => setData({ ...data, images: urls })}
          max={20}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold border-b border-gray-100 pb-3">发布设置</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={data.published}
              onChange={(e) => setData({ ...data, published: e.target.checked })}
            />
            <span>发布</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={data.featured}
              onChange={(e) => setData({ ...data, featured: e.target.checked })}
            />
            <span>首页精选展示</span>
          </label>

          <div>
            <label className="label">排序</label>
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
          {saving ? '保存中...' : '保存案例'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">取消</button>
      </div>
    </form>
  )
}
