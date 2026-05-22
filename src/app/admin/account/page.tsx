'use client'

import { useState } from 'react'

export default function AccountPage() {
  const [oldPassword, setOld] = useState('')
  const [newPassword, setNew] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (newPassword.length < 6) {
      setMsg({ type: 'err', text: '新密码至少 6 位' })
      return
    }
    if (newPassword !== confirm) {
      setMsg({ type: 'err', text: '两次输入的新密码不一致' })
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    setLoading(false)
    if (res.ok) {
      setMsg({ type: 'ok', text: '密码已修改' })
      setOld('')
      setNew('')
      setConfirm('')
    } else {
      const e = await res.json()
      setMsg({ type: 'err', text: e.error || '修改失败' })
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">修改密码</h1>

      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label">当前密码</label>
          <input
            type="password"
            required
            className="input"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
          />
        </div>
        <div>
          <label className="label">新密码（至少 6 位）</label>
          <input
            type="password"
            required
            className="input"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
          />
        </div>
        <div>
          <label className="label">再次输入新密码</label>
          <input
            type="password"
            required
            className="input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {msg && (
          <div className={`rounded-lg px-4 py-2 text-sm ${msg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            {msg.text}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? '修改中...' : '修改密码'}
        </button>
      </form>
    </div>
  )
}
