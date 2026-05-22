import { prisma } from '@/lib/prisma'
import { getCurrentSession } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getCurrentSession()
  if (!session) return null

  // 按角色过滤可见分类
  const categoryFilter: { categoryId?: { in: number[] } } = {}
  if (session.role !== 'ADMIN') {
    const slug = session.role === 'FLOORMAT_MGR' ? 'floormat' : 'wheelcover'
    const cats = await prisma.category.findMany({ where: { slug }, select: { id: true } })
    categoryFilter.categoryId = { in: cats.map((c) => c.id) }
  }

  const [productCount, caseCount, recentProducts, recentCases] = await Promise.all([
    prisma.product.count({ where: categoryFilter }),
    prisma.case.count({ where: categoryFilter }),
    prisma.product.findMany({
      where: categoryFilter,
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.case.findMany({
      where: categoryFilter,
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">欢迎回来，{session.name}</h1>
        <p className="text-gray-500 mt-1">
          {session.role === 'ADMIN'
            ? '您拥有完整管理权限'
            : `您负责的产品线：${session.role === 'FLOORMAT_MGR' ? '汽车脚垫' : '手缝方向盘套'}`}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="产品数" value={productCount} href="/admin/products" icon="🛍️" />
        <StatCard label="案例数" value={caseCount} href="/admin/cases" icon="⭐" />
        <Link href="/admin/products/new" className="card hover:border-brand-500/50 transition-colors flex flex-col justify-center">
          <div className="text-3xl">➕</div>
          <div className="mt-2 font-semibold">添加新产品</div>
          <div className="text-sm text-gray-500 mt-1">立即录入一个新产品</div>
        </Link>
      </div>

      {/* 最近更新 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">最近产品</h3>
            <Link href="/admin/products" className="text-sm text-brand-600 hover:text-brand-600">
              全部 →
            </Link>
          </div>
          <div className="space-y-2">
            {recentProducts.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">还没有产品</p>
            ) : (
              recentProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category.name}</div>
                  </div>
                  {!p.published && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">未上架</span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">最近案例</h3>
            <Link href="/admin/cases" className="text-sm text-brand-600 hover:text-brand-600">
              全部 →
            </Link>
          </div>
          <div className="space-y-2">
            {recentCases.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">还没有案例</p>
            ) : (
              recentCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/cases/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    {c.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.coverImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.title}</div>
                    <div className="text-xs text-gray-500">
                      {c.category.name}
                      {c.carBrand && ` · ${c.carBrand} ${c.carModel || ''}`}
                    </div>
                  </div>
                  {c.featured && <span className="text-xs">⭐</span>}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      {session.role === 'ADMIN' && (
        <div className="card">
          <h3 className="font-semibold mb-3">管理员快捷入口</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickLink href="/admin/hero" label="编辑首页大图" />
            <QuickLink href="/admin/settings" label="公司信息" />
            <QuickLink href="/admin/users" label="账号管理" />
            <QuickLink href="/admin/gallery" label="工厂相册" />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, href, icon }: { label: string; value: number; href: string; icon: string }) {
  return (
    <Link href={href} className="card hover:border-brand-500/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Link>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm transition-colors text-center">
      {label}
    </Link>
  )
}
