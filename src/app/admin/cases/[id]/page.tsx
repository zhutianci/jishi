'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CaseForm, type CaseFormData } from '../_form'
import { safeJsonParse, formatDate } from '@/lib/utils'

export default function EditCasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [initial, setInitial] = useState<Partial<CaseFormData> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/cases/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error)
          return
        }
        const c = d.case
        setInitial({
          categoryId: c.categoryId,
          title: c.title,
          carBrand: c.carBrand || '',
          carModel: c.carModel || '',
          customerFeedback: c.customerFeedback || '',
          description: c.description || '',
          coverImage: c.coverImage || '',
          images: safeJsonParse<string[]>(c.images, []),
          completedAt: c.completedAt ? formatDate(c.completedAt) : '',
          published: c.published,
          featured: c.featured,
          sortOrder: c.sortOrder,
        })
      })
  }, [params.id])

  async function onSubmit(data: CaseFormData) {
    const res = await fetch(`/api/admin/cases/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        images: JSON.stringify(data.images),
      }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '保存失败')
    router.push('/admin/cases')
    router.refresh()
  }

  if (error) return <div className="text-red-300">{error}</div>
  if (!initial) return <div className="text-white/40">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">编辑案例</h1>
      <CaseForm initial={initial} onSubmit={onSubmit} />
    </div>
  )
}
