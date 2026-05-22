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

  // 按首次出现顺序收集所有规格标签
  const labelOrder: string[] = []
  const seen = new Set<string>()
  const specMaps = new Map<number, Map<string, string>>()

  for (const p of products) {
    const arr = safeJsonParse<Spec[]>(p.specs, [])
    const map = new Map<string, string>()
    for (const s of arr) {
      if (!s.label || !s.value) continue
      map.set(s.label, s.value)
      if (!seen.has(s.label)) {
        seen.add(s.label)
        labelOrder.push(s.label)
      }
    }
    specMaps.set(p.id, map)
  }

  if (labelOrder.length === 0) return null

  return (
    <section className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-gray-200">
      <div className="mb-6 md:mb-10 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {categoryName ? `${categoryName} · 产品对比` : '产品对比'}
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            所有产品横向对比，一行一个款式
          </p>
        </div>
        <div className="text-xs text-gray-400 lg:hidden flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7l-4 4m0 0l4 4m-4-4h16m0 0l-4-4m4 4l-4 4" />
          </svg>
          左右滑动查看
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0 md:rounded-2xl md:border md:border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {/* 产品列（sticky 在左） */}
              <th className="sticky left-0 z-10 bg-gray-50 px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px] md:min-w-[260px]">
                产品
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                价格
              </th>
              {labelOrder.map((l) => (
                <th
                  key={l}
                  className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const zebra = i % 2 === 1
              const rowBg = zebra ? 'bg-gray-50/60' : 'bg-white'
              const stickyBg = zebra ? 'bg-gray-50' : 'bg-white'
              return (
                <tr key={p.id} className={`${rowBg} hover:bg-brand-50/30 transition-colors group`}>
                  <th
                    className={`sticky left-0 z-10 ${stickyBg} group-hover:bg-brand-50/50 px-4 md:px-6 py-4 md:py-5 text-left align-middle border-r border-gray-100`}
                  >
                    <Link href={`/products/${p.id}`} className="flex items-center gap-3 group/link">
                      <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 overflow-hidden">
                        {p.coverImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover group-hover/link:scale-105 transition-transform" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm md:text-base text-gray-900 group-hover/link:text-brand-600 transition-colors leading-tight line-clamp-2">
                          {p.name}
                        </div>
                        {p.shortDesc && (
                          <div className="hidden md:block text-xs text-gray-400 mt-1 line-clamp-1">
                            {p.shortDesc}
                          </div>
                        )}
                      </div>
                    </Link>
                  </th>
                  <td className="px-4 md:px-6 py-4 md:py-5 align-middle whitespace-nowrap">
                    {p.priceText ? (
                      <span className="text-brand-600 font-bold text-base md:text-lg">{p.priceText}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">面议</span>
                    )}
                  </td>
                  {labelOrder.map((l) => {
                    const v = specMaps.get(p.id)?.get(l)
                    return (
                      <td key={l} className="px-4 md:px-6 py-4 md:py-5 align-middle text-gray-800 leading-relaxed min-w-[120px]">
                        {v ? v : <span className="text-gray-300">—</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
