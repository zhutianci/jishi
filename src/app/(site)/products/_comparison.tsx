import Link from 'next/link'
import { safeJsonParse } from '@/lib/utils'

type Spec = { label: string; value: string }

type Product = {
  id: number
  name: string
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
    const specs = safeJsonParse<Spec[]>(p.specs, [])
    const map = new Map<string, string>()
    for (const s of specs) {
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
            横向对比所有产品的规格参数，一眼选定最适合您的款式
          </p>
        </div>
        <div className="text-xs text-gray-400 md:hidden flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7l-4 4m0 0l4 4m-4-4h16m0 0l-4-4m4 4l-4 4" />
          </svg>
          左右滑动查看
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0 rounded-2xl md:border md:border-gray-200">
        <table className="min-w-full">
          <colgroup>
            <col className="w-28 md:w-36" />
            {products.map((p) => (
              <col key={p.id} className="w-44 md:w-52 lg:w-56" />
            ))}
          </colgroup>

          {/* 产品头：图 / 名称 / 价格 */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 md:p-4 text-left text-xs font-medium text-gray-400 align-bottom border-b border-gray-200">
                规格 \ 产品
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className="p-3 md:p-4 text-left align-top border-l border-b border-gray-200 bg-white"
                >
                  <Link href={`/products/${p.id}`} className="group block">
                    <div className="aspect-square w-full max-w-[140px] bg-gray-100 rounded-lg overflow-hidden mb-3">
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
                    <div className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                      {p.name}
                    </div>
                    {p.priceText && (
                      <div className="text-base md:text-lg text-brand-600 font-bold mt-1.5 line-clamp-1">
                        {p.priceText}
                      </div>
                    )}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          {/* 规格行 */}
          <tbody>
            {labelOrder.map((label, i) => {
              const zebra = i % 2 === 1
              return (
                <tr key={label}>
                  <th
                    className={`sticky left-0 z-10 p-3 md:p-4 text-left text-sm font-medium text-gray-500 align-top border-b border-gray-100 ${
                      zebra ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    {label}
                  </th>
                  {products.map((p) => {
                    const val = specMaps.get(p.id)?.get(label)
                    return (
                      <td
                        key={p.id}
                        className={`p-3 md:p-4 text-sm text-gray-800 border-l border-b border-gray-100 align-top leading-relaxed ${
                          zebra ? 'bg-gray-50/60' : 'bg-white'
                        }`}
                      >
                        {val ? val : <span className="text-gray-300">—</span>}
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
