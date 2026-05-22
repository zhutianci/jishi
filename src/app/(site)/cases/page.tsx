import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = { title: '案例展示' }

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { cat?: string; brand?: string }
}) {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  const activeCat = searchParams.cat ? categories.find((c) => c.slug === searchParams.cat) : null
  const activeBrand = searchParams.brand

  const where: {
    published: boolean
    categoryId?: number
    carBrand?: string
  } = { published: true }
  if (activeCat) where.categoryId = activeCat.id
  if (activeBrand) where.carBrand = activeBrand

  const cases = await prisma.case.findMany({
    where,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  // 收集所有车品牌做筛选
  const allBrands = await prisma.case.findMany({
    where: { published: true, carBrand: { not: null } },
    select: { carBrand: true },
    distinct: ['carBrand'],
  })
  const brands = allBrands.map((b) => b.carBrand).filter(Boolean) as string[]

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <div className="mb-12">
          <div className="text-brand-400 mb-2">案例展示</div>
          <h1 className="heading-1">真实客户案例</h1>
          <p className="text-white/60 mt-3 text-lg">所有案例图片均为真实客户车辆实拍，所见即所得</p>
        </div>

        {/* 分类筛选 */}
        <div className="space-y-3 mb-10">
          <div>
            <div className="text-xs text-white/40 mb-2">产品线</div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/cases${activeBrand ? `?brand=${activeBrand}` : ''}`}
                className={`px-4 py-1.5 rounded-full text-sm ${!activeCat ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                全部
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases?cat=${c.slug}${activeBrand ? `&brand=${activeBrand}` : ''}`}
                  className={`px-4 py-1.5 rounded-full text-sm ${activeCat?.id === c.id ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <div className="text-xs text-white/40 mb-2">车品牌</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/cases${activeCat ? `?cat=${activeCat.slug}` : ''}`}
                  className={`px-4 py-1.5 rounded-full text-sm ${!activeBrand ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  全部
                </Link>
                {brands.map((b) => (
                  <Link
                    key={b}
                    href={`/cases?${activeCat ? `cat=${activeCat.slug}&` : ''}brand=${encodeURIComponent(b)}`}
                    className={`px-4 py-1.5 rounded-full text-sm ${activeBrand === b ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 案例网格 */}
        {cases.length === 0 ? (
          <div className="card text-center py-20 text-white/40">暂无符合条件的案例</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 block"
              >
                {c.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full skeleton" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-xs">{c.category.name}</span>
                  {c.featured && <span className="px-2 py-0.5 rounded-full bg-gold-500/80 backdrop-blur text-xs text-ink-950">⭐ 精选</span>}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-xs text-brand-300 mb-1">
                    {[c.carBrand, c.carModel].filter(Boolean).join(' ')}
                  </div>
                  <div className="font-semibold line-clamp-2">{c.title}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
