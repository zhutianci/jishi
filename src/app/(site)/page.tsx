import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { safeJsonParse } from '@/lib/utils'
import { HeroSection } from './_components/hero'
import { ProductLineCard } from './_components/product-line-card'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getSettings()

  const [slides, categories, featuredCases, latestProducts] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: { where: { published: true } } } },
      },
    }),
    prisma.case.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
    prisma.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const slogan = settings['company.slogan'] || '源头工厂 · 精工品质'
  const companyShort = settings['company.shortName'] || '吉狮汽饰'

  return (
    <>
      <HeroSection
        slides={slides.length > 0 ? slides : [{
          id: 0,
          title: slogan,
          subtitle: `${companyShort} · 专业汽车脚垫与手缝方向盘套源头制造商`,
          imageUrl: '',
          ctaText: '查看产品',
          ctaLink: '/products',
        }]}
      />

      {/* 两大产品线入口 */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="heading-2 mb-4">
              <span className="bg-gradient-to-r from-brand-400 to-gold-500 bg-clip-text text-transparent">
                两大产品线
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              专注汽车内饰精工制造，为每位车主提供量身定制的高品质内饰配件
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <ProductLineCard
                key={cat.id}
                slug={cat.slug}
                name={cat.name}
                subtitle={cat.subtitle || ''}
                coverUrl={cat.coverUrl}
                count={cat._count.products}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 精选案例 */}
      {featuredCases.length > 0 && (
        <section className="section bg-gradient-to-b from-transparent via-brand-900/5 to-transparent">
          <div className="container">
            <div className="flex items-end justify-between mb-8 md:mb-12 flex-wrap gap-4">
              <div>
                <h2 className="heading-2 mb-2">精选案例</h2>
                <p className="text-gray-500">真实客户实拍，所见即所得</p>
              </div>
              <Link href="/cases" className="text-brand-600 hover:text-brand-600 text-sm">
                查看全部案例 →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {featuredCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                    <div className="text-xs text-brand-300 mb-1">
                      {c.category.name}
                      {c.carBrand && ` · ${c.carBrand}${c.carModel || ''}`}
                    </div>
                    <div className="font-semibold text-sm md:text-base line-clamp-2">{c.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 工艺亮点 */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="heading-2 mb-4">为什么选择吉狮</h2>
            <p className="text-gray-500">从原料到成品，每个环节都严格把控</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🏭"
              title="源头工厂"
              desc="自有车间、自有团队，省去中间环节，价格优势明显"
            />
            <FeatureCard
              icon="✋"
              title="精工手作"
              desc="方向盘套每一针每一线都是熟练工匠手缝，细节经得起放大检查"
            />
            <FeatureCard
              icon="🛡️"
              title="品质保证"
              desc="原材料层层筛选，成品三道质检，售后无忧"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/craft" className="btn-secondary">
              了解更多工艺细节 →
            </Link>
          </div>
        </div>
      </section>

      {/* 最新产品 */}
      {latestProducts.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28">
          <div className="container">
            <div className="flex items-end justify-between mb-8 md:mb-12 flex-wrap gap-4">
              <div>
                <h2 className="heading-2 mb-2">最新产品</h2>
                <p className="text-gray-500">查看我们最近上架的新品</p>
              </div>
              <Link href="/products" className="text-brand-600 hover:text-brand-600 text-sm">
                查看全部产品 →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {latestProducts.map((p) => {
                const features = safeJsonParse<string[]>(p.features, [])
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group card !p-4 hover:border-brand-500/50 transition-colors"
                  >
                    <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-3">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full skeleton" />
                      )}
                    </div>
                    <div className="text-xs text-brand-600 mb-1">{p.category.name}</div>
                    <div className="font-medium text-sm line-clamp-2 mb-1">{p.name}</div>
                    {features[0] && <div className="text-xs text-gray-500 line-clamp-1">{features[0]}</div>}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container">
          <div className="card !p-8 md:!p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="heading-2 mb-4">联系我们获取报价</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                无论是大批量采购还是单台定制，添加微信都可以快速沟通需求与方案
              </p>
              <Link href="/contact" className="btn-primary">
                添加客服微信
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}
