import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { safeJsonParse } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = { title: '产品中心' }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string }
}) {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  const activeSlug = searchParams.cat
  const activeCat = activeSlug ? categories.find((c) => c.slug === activeSlug) : null

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(activeCat ? { categoryId: activeCat.id } : {}),
    },
    include: { category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="pt-28 md:pt-32 pb-12 md:pb-20">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="text-brand-600 mb-2">产品中心</div>
          <h1 className="heading-1">{activeCat ? activeCat.name : '全部产品'}</h1>
          {activeCat?.subtitle && (
            <p className="text-gray-600 mt-3 text-lg">{activeCat.subtitle}</p>
          )}
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/products"
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              !activeSlug ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?cat=${c.slug}`}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                activeSlug === c.slug ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* 产品网格 */}
        {products.length === 0 ? (
          <div className="card text-center py-20 text-gray-500">
            该分类暂无产品
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => {
              const specs = safeJsonParse<{ label: string; value: string }[]>(p.specs, [])
              // 卡片上挑 2 条关键规格展示（材质/质保 优先）
              const hilightLabels = ['材质', '质保', '使用寿命', '颜色', '工艺']
              const hilights = hilightLabels
                .map((l) => specs.find((s) => s.label === l))
                .filter(Boolean)
                .slice(0, 2) as { label: string; value: string }[]

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-brand-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full skeleton" />
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="text-xs text-brand-600 mb-1.5">{p.category.name}</div>
                    <div className="font-semibold text-base md:text-lg text-gray-900 line-clamp-2 mb-1.5 leading-snug">{p.name}</div>
                    {p.shortDesc && (
                      <div className="text-xs text-gray-500 line-clamp-2 mb-3">{p.shortDesc}</div>
                    )}

                    {hilights.length > 0 && (
                      <div className="space-y-1 mb-3 text-xs">
                        {hilights.map((s, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-gray-400 w-12 shrink-0">{s.label}</span>
                            <span className="text-gray-800 line-clamp-1">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 价格固定在底部 */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-baseline justify-between gap-2">
                      {p.priceText ? (
                        <span className="text-lg md:text-xl text-brand-600 font-bold line-clamp-1">{p.priceText}</span>
                      ) : (
                        <span className="text-sm text-gray-400">面议</span>
                      )}
                      <span className="text-xs text-gray-400 group-hover:text-brand-600 transition-colors whitespace-nowrap">
                        详情 →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
