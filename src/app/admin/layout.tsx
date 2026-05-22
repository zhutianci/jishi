import { getCurrentSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from './_components/shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession()
  // 登录页特殊处理在子布局中

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900">
      {session ? (
        <AdminShell session={session}>{children}</AdminShell>
      ) : (
        // /admin/login 页面不需要 shell，会自行渲染
        <>{children}</>
      )}
    </div>
  )
}
