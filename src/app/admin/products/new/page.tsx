'use client'

import { useRouter } from 'next/navigation'
import { ProductForm, type ProductFormData } from '../_form'

export default function NewProductPage() {
  const router = useRouter()

  async function onSubmit(data: ProductFormData) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        features: JSON.stringify(data.features),
        specs: JSON.stringify(data.specs.filter((s) => s.label.trim() && s.value.trim())),
        images: JSON.stringify(data.images),
      }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '创建失败')
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新增产品</h1>
      <ProductForm onSubmit={onSubmit} />
    </div>
  )
}
