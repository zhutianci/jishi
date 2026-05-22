'use client'

import { useRouter } from 'next/navigation'
import { CaseForm, type CaseFormData } from '../_form'

export default function NewCasePage() {
  const router = useRouter()

  async function onSubmit(data: CaseFormData) {
    const res = await fetch('/api/admin/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        images: JSON.stringify(data.images),
      }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '创建失败')
    router.push('/admin/cases')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新增案例</h1>
      <CaseForm onSubmit={onSubmit} />
    </div>
  )
}
