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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {products.map((p) => {
              const features = safeJsonParse<string[]>(p.features, [])
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group card !p-4 hover:border-brand-500/50 transition-all hover:-translate-y-1"
                >
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full skeleton" />
                    )}
                  </div>
                  <div className="text-xs text-brand-600 mb-1">{p.category.name}</div>
                  <div className="font-medium line-clamp-2 mb-2">{p.name}</div>
                  {p.priceText && (
                    <div className="text-base md:text-lg text-brand-600 font-semibold mb-2 line-clamp-1">
                      {p.priceText}
                    </div>
                  )}
                  {p.shortDesc && <div className="text-xs text-gray-500 line-clamp-2 mb-2">{p.shortDesc}</div>}
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 2).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
