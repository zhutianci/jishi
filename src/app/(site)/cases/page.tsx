import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Reveal } from '@/components/site/reveal'
import { SectionLabel } from '@/components/site/section-label'

export const dynamic = 'force-dynamic'

export const metadata = { title: '案例展示' }

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { cat?: string; brand?: string }
}) {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  const activeCat = searchParams.cat ? categories.find((c) => c.slug === searchParams.cat) : null
  const activeBrand = searchParams.brand

  const where: { published: boolean; categoryId?: number; carBrand?: string } = { published: true }
  if (activeCat) where.categoryId = activeCat.id
  if (activeBrand) where.carBrand = activeBrand

  const cases = await prisma.case.findMany({
    where,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  const allBrands = await prisma.case.findMany({
    where: { published: true, carBrand: { not: null } },
    select: { carBrand: true },
    distinct: ['carBrand'],
  })
  const brands = allBrands.map((b) => b.carBrand).filter(Boolean) as string[]

  return (
    <div className="pt-32 md:pt-44 pb-20 md:pb-32">
      <div className="container">
        <Reveal><SectionLabel number="03">真实案例</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-1 mt-6 md:mt-10 max-w-5xl text-balance">
            真实车 真实人 <br />
            <span className="italic font-light text-brand-600">真实的吉狮。</span>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 md:mt-10 max-w-2xl text-lg md:text-xl text-ink-700 font-serif leading-relaxed">
            所有案例图片均为真实客户车辆实拍。
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 md:mt-16 space-y-6">
            <Filters
              label="产品线"
              items={[
                { href: `/cases${activeBrand ? `?brand=${activeBrand}` : ''}`, active: !activeCat, label: '全部' },
                ...categories.map((c) => ({
                  href: `/cases?cat=${c.slug}${activeBrand ? `&brand=${activeBrand}` : ''}`,
                  active: activeCat?.id === c.id,
                  label: c.name,
                })),
              ]}
            />
            {brands.length > 0 && (
              <Filters
                label="车品牌"
                items={[
                  { href: `/cases${activeCat ? `?cat=${activeCat.slug}` : ''}`, active: !activeBrand, label: '全部' },
                  ...brands.map((b) => ({
                    href: `/cases?${activeCat ? `cat=${activeCat.slug}&` : ''}brand=${encodeURIComponent(b)}`,
                    active: activeBrand === b,
                    label: b,
                  })),
                ]}
              />
            )}
          </div>
        </Reveal>

        {cases.length === 0 ? (
          <div className="mt-20 text-center text-ink-400 italic">暂无符合条件的案例</div>
        ) : (
          <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {cases.map((c, i) => (
              <Reveal key={c.id} delay={(i % 6) * 0.05}>
                <Link href={`/cases/${c.id}`} className="group relative aspect-[4/5] overflow-hidden bg-ink-100 block">
                  {c.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full skeleton" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/30 to-transparent" />
                  <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

                  <div className="absolute top-3 left-3 md:top-5 md:left-5 flex gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-bone-50/80">{c.category.name}</span>
                  </div>
                  {c.featured && (
                    <span className="absolute top-3 right-3 md:top-5 md:right-5 text-[10px] font-mono uppercase tracking-widest text-brand-300">
                      ★ Featured
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-bone-50">
                    {c.carBrand && (
                      <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-brand-300 mb-2">
                        {c.carBrand} {c.carModel || ''}
                      </div>
                    )}
                    <div className="font-serif text-base md:text-2xl leading-snug line-clamp-2">{c.title}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Filters({ label, items }: { label: string; items: Array<{ href: string; active: boolean; label: string }> }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-3">{label}</div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`relative font-serif text-base md:text-lg transition-colors ${item.active ? 'text-ink-900' : 'text-ink-400 hover:text-ink-900'}`}
          >
            {item.label}
            {item.active && <span className="absolute -bottom-1 left-0 right-0 h-px bg-ink-900" />}
          </Link>
        ))}
      </div>
    </div>
  )
}
