import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { safeJsonParse } from '@/lib/utils'
import { HeroSection } from './_components/hero'
import { ProductLineCard } from './_components/product-line-card'
import { Reveal } from '@/components/site/reveal'
import { Marquee } from '@/components/site/marquee'
import { SectionLabel } from '@/components/site/section-label'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getSettings()

  const [slides, categories, featuredCases, latestProducts] = await Promise.all([
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { published: true } } } } },
    }),
    prisma.case.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 7,
    }),
    prisma.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const slogan = settings['company.slogan'] || '一针一线 · 精工于物'
  const intro = settings['company.intro'] ||
    '我们是位于江苏灌云的一家专注汽车内饰精工制造的小型工坊。从一卷皮料、一颗螺丝开始，我们坚持手工缝制与源头品控，为每一辆车带来独一无二的内饰升级。'

  const marqueeItems = [
    '汽车脚垫',
    '手缝方向盘套',
    '源头工厂',
    '量身定制',
    '匠心制造',
    'Made in 灌云',
    '每米 18-22 针',
    '三道质检',
  ]

  return (
    <>
      <HeroSection
        slides={slides.length > 0 ? slides : [{
          id: 0,
          title: slogan,
          subtitle: '专注汽车脚垫与手缝方向盘套，源自江苏灌云的精工制造',
          imageUrl: '',
          ctaText: '探索产品',
          ctaLink: '/products',
        }]}
      />

      {/* Marquee 跑马灯 */}
      <div className="border-y border-ink-100 bg-bone-50 py-5 md:py-6 text-ink-800 font-serif">
        <Marquee
          items={marqueeItems.map((t, i) => (
            <span key={i} className="text-2xl md:text-3xl italic">
              {t}
            </span>
          ))}
        />
      </div>

      {/* 01 · 关于 — 编辑级排版 */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <SectionLabel number="01">关于吉狮</SectionLabel>
              <h2 className="heading-2 mt-6 lg:mt-10 text-balance">
                让每一辆车 <br />
                <span className="italic font-light text-brand-600">都有故事可讲。</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 self-end">
              <p className="text-lg md:text-xl text-ink-700 leading-[1.75] font-serif max-w-xl">
                {intro}
              </p>
              <div className="mt-8 flex items-center gap-6">
                <Link href="/about" className="btn-ghost">
                  阅读品牌故事
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* 数字证据 */}
          <Reveal delay={0.2}>
            <div className="mt-20 lg:mt-32 grid grid-cols-2 lg:grid-cols-4 border-t border-ink-100">
              {[
                { num: '04+', label: '年制造经验' },
                { num: '02', label: '主营产品线' },
                { num: '100%', label: '源头工厂' },
                { num: '24h', label: '响应速度' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`py-8 md:py-12 px-2 md:px-6 ${i !== 0 ? 'border-l border-ink-100' : ''} ${i >= 2 ? 'border-t lg:border-t-0 border-ink-100' : ''}`}
                >
                  <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 tracking-tight">{stat.num}</div>
                  <div className="mt-2 text-xs md:text-sm font-mono uppercase tracking-widest text-ink-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 · 产品线 */}
      <section className="section bg-bone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply pointer-events-none" />
        <div className="container relative">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
            <Reveal>
              <SectionLabel number="02">产品系列</SectionLabel>
              <h2 className="heading-2 mt-6 max-w-2xl text-balance">
                两条产品线 <br />
                <span className="italic font-light text-brand-600">同一份匠心。</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/products" className="btn-ghost">
                查看全部
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.12}>
                <ProductLineCard
                  slug={cat.slug}
                  name={cat.name}
                  subtitle={cat.subtitle || ''}
                  coverUrl={cat.coverUrl}
                  count={cat._count.products}
                  number={String(i + 1).padStart(2, '0')}
                  align={(i % 2 + 1) as 1 | 2}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · 案例（magazine grid） */}
      {featuredCases.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
              <Reveal>
                <SectionLabel number="03">真实案例</SectionLabel>
                <h2 className="heading-2 mt-6 max-w-3xl text-balance">
                  每一件作品 <br />
                  <span className="italic font-light text-brand-600">都来自真实的车主。</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link href="/cases" className="btn-ghost">
                  全部案例
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Reveal>
            </div>

            <MagazineGrid cases={featuredCases} />
          </div>
        </section>
      )}

      {/* 04 · 工艺 */}
      <section className="section bg-ink-900 text-bone-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="container relative">
          <Reveal>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-bone-50/60">
              <span className="inline-block w-8 h-px bg-bone-50/40" />
              <span className="text-bone-50">04</span>
              <span className="text-bone-50/30">/</span>
              <span>工艺细节</span>
            </div>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-6 text-bone-50 max-w-3xl leading-[1.05] tracking-[-0.02em] text-balance">
              不在意细节的人 <br />
              <span className="italic font-light text-brand-300">做不出值得的产品。</span>
            </h2>
          </Reveal>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 lg:gap-20">
            {[
              { n: '01', t: '严选原料', d: '只用源头核心料，劣质料一律不进车间' },
              { n: '02', t: '精准量裁', d: '按车型 1:1 数据建模激光裁剪，零误差适配' },
              { n: '03', t: '手缝精工', d: '方向盘套全程手缝，每米 18-22 针均匀紧密' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="font-serif text-6xl md:text-7xl text-bone-50/20 mb-6">{item.n}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-bone-50 mb-3">{item.t}</h3>
                <p className="text-bone-100/70 leading-relaxed">{item.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-16 md:mt-24 flex justify-center md:justify-start">
              <Link
                href="/craft"
                className="inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-bone-50 hover:gap-5 transition-all duration-500 group"
              >
                完整工艺流程
                <span className="block w-12 h-px bg-bone-50 group-hover:w-20 transition-all duration-500" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 · 最新产品 */}
      {latestProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
              <Reveal>
                <SectionLabel number="05">最新产品</SectionLabel>
                <h2 className="heading-2 mt-6 max-w-2xl text-balance">
                  最近上架 <br />
                  <span className="italic font-light text-brand-600">值得一看的新品。</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link href="/products" className="btn-ghost">
                  全部产品
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {latestProducts.map((p, i) => {
                const features = safeJsonParse<string[]>(p.features, [])
                return (
                  <Reveal key={p.id} delay={i * 0.08}>
                    <Link href={`/products/${p.id}`} className="group block">
                      <div className="aspect-square bg-ink-100 overflow-hidden mb-4 relative">
                        {p.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full skeleton" />
                        )}
                        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-400 mb-2">{p.category.name}</div>
                      <div className="font-serif text-lg md:text-xl text-ink-900 leading-snug">{p.name}</div>
                      {features[0] && <div className="mt-1.5 text-xs text-ink-400 line-clamp-1">{features[0]}</div>}
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-bone-100 relative overflow-hidden border-y border-ink-100">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply pointer-events-none" />
        <div className="container relative">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-400 mb-6">
                <span className="inline-block w-8 h-px bg-ink-400" />
                <span className="text-ink-700">06</span>
                <span className="text-ink-300">/</span>
                <span>联系合作</span>
              </div>
              <h2 className="font-serif font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 text-ink-900 leading-[1.05] tracking-[-0.025em] text-balance">
                想为您的车 <br />
                做点 <span className="italic font-light text-brand-600">不一样的事</span>。
              </h2>
              <p className="mt-8 text-base md:text-lg text-ink-700 max-w-xl mx-auto leading-relaxed">
                添加对应业务的微信，从需求沟通到方案出图，最快当天给您答复。
              </p>
              <div className="mt-10 md:mt-12 flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contact" className="btn-primary">
                  立即联系
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/cases" className="btn-secondary">
                  看更多案例
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/** Magazine 风格的案例网格（不对称） */
function MagazineGrid({ cases }: { cases: Array<{ id: number; title: string; coverImage: string | null; carBrand: string | null; carModel: string | null; category: { name: string } }> }) {
  const [big, ...rest] = cases
  return (
    <div className="grid grid-cols-12 gap-3 md:gap-6 auto-rows-[140px] md:auto-rows-[180px] lg:auto-rows-[220px]">
      {big && <CaseCell c={big} className="col-span-12 md:col-span-8 row-span-2" featured />}
      {rest.slice(0, 1).map((c) => (
        <CaseCell key={c.id} c={c} className="col-span-6 md:col-span-4" />
      ))}
      {rest.slice(1, 2).map((c) => (
        <CaseCell key={c.id} c={c} className="col-span-6 md:col-span-4" />
      ))}
      {rest.slice(2, 5).map((c) => (
        <CaseCell key={c.id} c={c} className="col-span-6 md:col-span-4 row-span-1" />
      ))}
      {rest.slice(5, 6).map((c) => (
        <CaseCell key={c.id} c={c} className="col-span-12 md:col-span-12 row-span-1" />
      ))}
    </div>
  )
}

function CaseCell({
  c,
  className,
  featured,
}: {
  c: { id: number; title: string; coverImage: string | null; carBrand: string | null; carModel: string | null; category: { name: string } }
  className: string
  featured?: boolean
}) {
  return (
    <Link href={`/cases/${c.id}`} className={`group relative overflow-hidden bg-ink-100 ${className}`}>
      {c.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.coverImage}
          alt={c.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full skeleton" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      <div className="absolute top-3 left-3 md:top-5 md:left-5 text-[10px] font-mono uppercase tracking-widest text-bone-50/80">
        {c.category.name}
      </div>
      <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 text-bone-50">
        {c.carBrand && (
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-brand-300 mb-1">
            {c.carBrand} {c.carModel || ''}
          </div>
        )}
        <div className={`font-serif ${featured ? 'text-xl md:text-3xl lg:text-4xl' : 'text-sm md:text-lg'} leading-snug line-clamp-2`}>
          {c.title}
        </div>
      </div>
    </Link>
  )
}
