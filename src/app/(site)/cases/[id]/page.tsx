import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { safeJsonParse, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CaseGallery } from './_gallery'
import { ContactBlock } from '../../_components/contact-block'

export const dynamic = 'force-dynamic'

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (!id) notFound()

  const item = await prisma.case.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!item || !item.published) notFound()

  const settings = await getSettings()
  const images = safeJsonParse<string[]>(item.images, [])
  const allImages = [item.coverImage, ...images].filter(Boolean) as string[]
  const isFloormat = item.category.slug === 'floormat'

  const related = await prisma.case.findMany({
    where: { published: true, categoryId: item.categoryId, id: { not: item.id } },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/cases" className="hover:text-gray-900">案例展示</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{item.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* 图片 */}
          <div className="lg:col-span-2">
            <CaseGallery images={allImages} />
          </div>

          {/* 信息 */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-600 text-xs">
                  {item.category.name}
                </span>
                {item.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-600 text-xs">⭐ 精选</span>
                )}
              </div>
              <h1 className="heading-3 mb-3">{item.title}</h1>
              {(item.carBrand || item.carModel) && (
                <div className="text-gray-600">
                  车型：<span className="text-gray-900 font-medium">{[item.carBrand, item.carModel].filter(Boolean).join(' ')}</span>
                </div>
              )}
              {item.completedAt && (
                <div className="text-gray-500 text-sm mt-1">
                  完成时间：{formatDate(item.completedAt)}
                </div>
              )}
            </div>

            {item.description && (
              <div>
                <h3 className="font-semibold mb-2">案例描述</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</div>
              </div>
            )}

            {item.customerFeedback && (
              <div className="card !p-5">
                <div className="text-sm text-brand-600 mb-2">客户反馈</div>
                <p className="text-gray-800 leading-relaxed italic">
                  &ldquo;{item.customerFeedback}&rdquo;
                </p>
              </div>
            )}

            <ContactBlock
              settings={settings}
              prefix={isFloormat ? 'contact.huangwei' : 'contact.zhusuting'}
              productLine={isFloormat ? '脚垫' : '方向盘套'}
            />
          </div>
        </div>

        {/* 相关案例 */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="heading-3 mb-6">同类案例</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/cases/${r.id}`}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative"
                >
                  {r.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs text-white line-clamp-2">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
