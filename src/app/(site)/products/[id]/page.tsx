import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { safeJsonParse } from '@/lib/utils'
import { getCategoryContactKey, getContactProductLine } from '@/lib/category'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGallery } from './_gallery'
import { ContactBlock } from '../../_components/contact-block'

export const dynamic = 'force-dynamic'

type Spec = { label: string; value: string }

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (!id) notFound()

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!product || !product.published) notFound()

  const settings = await getSettings()
  const features = safeJsonParse<string[]>(product.features, [])
  const specs = safeJsonParse<Spec[]>(product.specs, [])
  const images = safeJsonParse<string[]>(product.images, [])
  const fitModels = product.fitCarModels?.split(/[,，、\s]+/).filter(Boolean) || []
  const allImages = [product.coverImage, ...images].filter(Boolean) as string[]

  const contactKey = getCategoryContactKey(product.category)
  const productLine = getContactProductLine(contactKey) || product.category.name

  const related = await prisma.product.findMany({
    where: {
      published: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="pt-28 md:pt-32 pb-12 md:pb-20">
      <div className="container">
        {/* 面包屑 */}
        <nav className="text-sm text-gray-500 mb-6 md:mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-900">首页</Link>
          <span>/</span>
          <Link href={`/products?cat=${product.category.slug}`} className="hover:text-gray-900">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* 图片 */}
          <ProductGallery images={allImages} />

          {/* 信息 */}
          <div className="lg:pt-2">
            {/* 分类标 */}
            <div className="inline-flex items-center gap-2 text-xs text-brand-600 mb-3">
              <span className="inline-block w-6 h-px bg-brand-600" />
              {product.category.name}
            </div>

            {/* 产品名 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* 短描述 */}
            {product.shortDesc && (
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                {product.shortDesc}
              </p>
            )}

            {/* 价格 */}
            {product.priceText && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="text-xs text-gray-500 mb-1.5">参考价格</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-brand-600">{product.priceText}</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">实际价格以联系客服报价为准</p>
              </div>
            )}

            {/* 卖点 */}
            {features.length > 0 && (
              <div className="mb-8">
                <div className="text-xs text-gray-500 mb-3">核心亮点</div>
                <ul className="space-y-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-800">
                      <svg className="w-5 h-5 mt-0.5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 规格参数表 */}
            {specs.length > 0 && (
              <div className="mb-8">
                <div className="text-xs text-gray-500 mb-3">规格参数</div>
                <div className="border-t border-gray-200">
                  {specs.map((s, i) => (
                    <div key={i} className="grid grid-cols-12 gap-3 py-3 border-b border-gray-100 text-sm">
                      <div className="col-span-4 md:col-span-3 text-gray-500">{s.label}</div>
                      <div className="col-span-8 md:col-span-9 text-gray-900 font-medium">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 适配车型 */}
            {fitModels.length > 0 && (
              <div className="mb-8">
                <div className="text-xs text-gray-500 mb-3">适配车型</div>
                <div className="flex flex-wrap gap-2">
                  {fitModels.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 联系 */}
            <div className="pt-6 border-t border-gray-200">
              <ContactBlock
                settings={settings}
                prefix={`contact.${contactKey}`}
                productLine={productLine}
              />
            </div>
          </div>
        </div>

        {/* 详细描述 */}
        {product.description && (
          <section className="mt-12 md:mt-20">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">产品详情</h2>
              <div className="card !p-6 md:!p-10">
                <div className="prose max-w-none">
                  {product.description.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i} className="text-gray-700 leading-[1.9] mb-4 last:mb-0 text-base md:text-lg">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 相关产品 */}
        {related.length > 0 && (
          <section className="mt-12 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">同类产品</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  className="group card !p-3 md:!p-4 hover:border-brand-500/50 transition-all hover:-translate-y-0.5"
                >
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-3">
                    {r.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{r.name}</div>
                  {r.priceText && <div className="text-sm text-brand-600 font-semibold line-clamp-1">{r.priceText}</div>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
