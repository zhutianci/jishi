'use client'

import { useEffect, useState } from 'react'

type User = {
  id: number
  email: string
  name: string
  role: 'ADMIN' | 'FLOORMAT_MGR' | 'WHEELCOVER_MGR'
  active: boolean
  lastLoginAt: string | null
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: '超级管理员',
  FLOORMAT_MGR: '脚垫负责人',
  WHEELCOVER_MGR: '方向盘套负责人',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<User & { password?: string }> | null>(null)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/users').then((r) => r.json())
    setUsers(r.users || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    if (!editing) return
    const isNew = !editing.id
    if (isNew && (!editing.email || !editing.password || !editing.name || !editing.role)) {
      alert('请填写完整')
      return
    }
    const url = isNew ? '/api/admin/users' : `/api/admin/users/${editing.id}`
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      setEditing(null)
      load()
    } else {
      const e = await res.json()
      alert(e.error || '保存失败')
    }
  }

  async function remove(u: User) {
    if (!confirm(`确认删除用户 ${u.email}？`)) return
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const e = await res.json()
      alert(e.error || '删除失败')
      return
    }
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">账号管理</h1>
          <p className="text-sm text-white/40 mt-1">共 {users.length} 个账号</p>
        </div>
        <button onClick={() => setEditing({ role: 'FLOORMAT_MGR', active: true })} className="btn-primary">
          + 新增账号
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-white/40">加载中...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-white/40">
                <th className="p-4 font-medium">姓名</th>
                <th className="p-4 font-medium">邮箱</th>
                <th className="p-4 font-medium">角色</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">最后登录</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-white/60">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 text-xs">
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${u.active ? 'bg-green-500/15 text-green-300' : 'bg-white/10 text-white/40'}`}>
                      {u.active ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="p-4 text-white/40 text-xs">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('zh-CN') : '从未登录'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => setEditing(u)} className="text-brand-400 hover:underline">编辑</button>
                    <button onClick={() => remove(u)} className="text-red-400 hover:underline">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editing.id ? '编辑' : '新增'}账号</h3>
            <div className="space-y-4">
              <div>
                <label className="label">姓名 *</label>
                <input
                  type="text"
                  className="input"
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">邮箱 *{editing.id && '（不可修改）'}</label>
                <input
                  type="email"
                  className="input"
                  value={editing.email || ''}
                  disabled={!!editing.id}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">{editing.id ? '重置密码（留空则不改）' : '初始密码 *'}</label>
                <input
                  type="text"
                  className="input"
                  value={editing.password || ''}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  placeholder="至少 6 位"
                />
              </div>
              <div>
                <label className="label">角色 *</label>
                <select
                  className="input"
                  value={editing.role || 'FLOORMAT_MGR'}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value as User['role'] })}
                >
                  <option value="ADMIN">超级管理员（全部权限）</option>
                  <option value="FLOORMAT_MGR">脚垫负责人</option>
                  <option value="WHEELCOVER_MGR">方向盘套负责人</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={editing.active !== false}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                <span>启用账号</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="btn-primary flex-1">保存</button>
                <button onClick={() => setEditing(null)} className="btn-secondary">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
