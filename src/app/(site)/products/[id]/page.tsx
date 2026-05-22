import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { safeJsonParse } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGallery } from './_gallery'
import { ContactBlock } from '../../_components/contact-block'

export const dynamic = 'force-dynamic'

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
  const images = safeJsonParse<string[]>(product.images, [])
  const fitModels = product.fitCarModels?.split(/[,，、\s]+/).filter(Boolean) || []
  const allImages = [product.coverImage, ...images].filter(Boolean) as string[]

  const isFloormat = product.category.slug === 'floormat'
  const contactPrefix = isFloormat ? 'contact.huangwei' : 'contact.zhusuting'

  // 相关产品
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
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">首页</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?cat=${product.category.slug}`} className="hover:text-gray-900">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* 图片 */}
          <ProductGallery images={allImages} />

          {/* 信息 */}
          <div>
            <div className="text-brand-600 text-sm mb-2">{product.category.name}</div>
            <h1 className="heading-2 mb-4">{product.name}</h1>
            {product.shortDesc && (
              <p className="text-gray-600 text-lg mb-6">{product.shortDesc}</p>
            )}

            {/* 卖点 */}
            {features.length > 0 && (
              <div className="space-y-3 mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 text-brand-600">✓</span>
                    <span className="text-gray-800">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 材质 */}
            {product.material && (
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">材质</div>
                <div className="text-gray-900">{product.material}</div>
              </div>
            )}

            {/* 适配车型 */}
            {fitModels.length > 0 && (
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">适配车型</div>
                <div className="flex flex-wrap gap-2">
                  {fitModels.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 联系按钮 */}
            <ContactBlock
              settings={settings}
              prefix={contactPrefix}
              productLine={isFloormat ? '脚垫' : '方向盘套'}
            />
          </div>
        </div>

        {/* 详细描述 */}
        {product.description && (
          <section className="mt-12 md:mt-20">
            <h2 className="heading-3 mb-6">产品详情</h2>
            <div className="card max-w-4xl">
              <div className="prose max-w-none">
                {product.description.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 相关产品 */}
        {related.length > 0 && (
          <section className="mt-12 md:mt-20">
            <h2 className="heading-3 mb-6">同类产品</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  className="card !p-3 hover:border-brand-500/50 transition-colors"
                >
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-2">
                    {r.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="text-sm line-clamp-2">{r.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
