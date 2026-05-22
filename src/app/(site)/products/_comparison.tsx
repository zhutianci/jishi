import Link from 'next/link'
import { safeJsonParse } from '@/lib/utils'

type Spec = { label: string; value: string }

type Product = {
  id: number
  name: string
  shortDesc: string | null
  priceText: string | null
  coverImage: string | null
  specs: string | null
}

export function ComparisonTable({ products, categoryName }: { products: Product[]; categoryName?: string }) {
  if (products.length < 2) return null

  // 至少有一个产品有规格才展示
  const anySpec = products.some((p) => {
    const arr = safeJsonParse<Spec[]>(p.specs, [])
    return arr.some((s) => s.label && s.value)
  })
  if (!anySpec) return null

  return (
    <section className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-gray-200">
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {categoryName ? `${categoryName} · 完整规格对比` : '完整规格对比'}
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          同分类下所有产品的详细规格，方便您选定最适合的款式
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {products.map((p) => {
          const specs = safeJsonParse<Spec[]>(p.specs, []).filter((s) => s.label && s.value)
          return (
            <article
              key={p.id}
              className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-500/30 transition-all duration-300"
            >
              {/* 图片 */}
              <Link href={`/products/${p.id}`} className="group block aspect-[4/3] bg-gray-100 overflow-hidden">
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
              </Link>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                {/* 名称 */}
                <Link
                  href={`/products/${p.id}`}
                  className="font-semibold text-lg md:text-xl text-gray-900 leading-snug hover:text-brand-600 transition-colors"
                >
                  {p.name}
                </Link>

                {/* 价格 */}
                {p.priceText && (
                  <div className="mt-2 mb-1 text-2xl md:text-3xl text-brand-600 font-bold">
                    {p.priceText}
                  </div>
                )}

                {/* 短描述 */}
                {p.shortDesc && (
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {p.shortDesc}
                  </p>
                )}

                {/* 规格列表 */}
                {specs.length > 0 && (
                  <dl className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                    {specs.map((s, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 text-sm">
                        <dt className="col-span-4 text-gray-500 leading-relaxed">{s.label}</dt>
                        <dd className="col-span-8 text-gray-900 font-medium leading-relaxed">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* CTA */}
                <Link
                  href={`/products/${p.id}`}
                  className="mt-6 pt-5 border-t border-gray-100 inline-flex items-center justify-between text-sm font-medium text-brand-600 hover:text-brand-700 group"
                >
                  <span>查看完整详情</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
