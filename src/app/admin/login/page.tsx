'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '登录失败')
      router.push(redirect)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md card space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4">
          <span className="text-2xl font-bold text-white">吉</span>
        </div>
        <h1 className="text-2xl font-bold">管理后台</h1>
        <p className="text-sm text-gray-500 mt-1">灌云吉狮汽车饰品</p>
      </div>

      <div>
        <label className="label">邮箱</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ji-shi.com"
          autoFocus
        />
      </div>

      <div>
        <label className="label">密码</label>
        <input
          type="password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '登录中...' : '登 录'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-stone-50 via-gray-100 to-stone-50">
      <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
