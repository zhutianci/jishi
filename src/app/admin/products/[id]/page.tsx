'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm, type ProductFormData } from '../_form'
import { safeJsonParse } from '@/lib/utils'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [initial, setInitial] = useState<Partial<ProductFormData> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error)
          return
        }
        const p = d.product
        setInitial({
          id: p.id,
          categoryId: p.categoryId,
          name: p.name,
          material: p.material || '',
          fitCarModels: p.fitCarModels || '',
          shortDesc: p.shortDesc || '',
          description: p.description || '',
          features: safeJsonParse<string[]>(p.features, []),
          coverImage: p.coverImage || '',
          images: safeJsonParse<string[]>(p.images, []),
          published: p.published,
          sortOrder: p.sortOrder,
        })
      })
  }, [params.id])

  async function onSubmit(data: ProductFormData) {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        features: JSON.stringify(data.features),
        images: JSON.stringify(data.images),
      }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '保存失败')
    router.push('/admin/products')
    router.refresh()
  }

  if (error) return <div className="text-red-600">{error}</div>
  if (!initial) return <div className="text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">编辑产品</h1>
      <ProductForm initial={initial} onSubmit={onSubmit} />
    </div>
  )
}
