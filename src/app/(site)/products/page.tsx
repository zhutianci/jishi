import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { safeJsonParse } from '@/lib/utils'
import { Reveal } from '@/components/site/reveal'
import { SectionLabel } from '@/components/site/section-label'

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
    where: { published: true, ...(activeCat ? { categoryId: activeCat.id } : {}) },
    include: { category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="pt-32 md:pt-44 pb-20 md:pb-32">
      <div className="container">
        <Reveal><SectionLabel number="02">产品系列</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-1 mt-6 md:mt-10 max-w-4xl text-balance">
            {activeCat ? activeCat.name : (<>全部产品 <br /><span className="italic font-light text-brand-600">逐件造化。</span></>)}
          </h1>
        </Reveal>
        {activeCat?.subtitle && (
          <Reveal delay={0.15}>
            <p className="mt-6 md:mt-8 max-w-2xl text-lg md:text-xl text-ink-700 font-serif leading-relaxed">{activeCat.subtitle}</p>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <div className="mt-12 md:mt-16 flex items-center gap-px overflow-x-auto scrollbar-hide border-y border-ink-100">
            <FilterPill href="/products" active={!activeSlug} label="全部" />
            {categories.map((c) => (
              <FilterPill key={c.id} href={`/products?cat=${c.slug}`} active={activeSlug === c.slug} label={c.name} />
            ))}
          </div>
        </Reveal>

        {products.length === 0 ? (
          <div className="mt-20 text-center text-ink-400 italic">该分类暂无产品</div>
        ) : (
          <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
            {products.map((p, i) => {
              const features = safeJsonParse<string[]>(p.features, [])
              return (
                <Reveal key={p.id} delay={(i % 4) * 0.08}>
                  <Link href={`/products/${p.id}`} className="group block">
                    <div className="aspect-[4/5] bg-ink-100 overflow-hidden mb-4 md:mb-6 relative">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full skeleton" />
                      )}
                      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
                      <span className="absolute top-3 left-3 md:top-4 md:left-4 text-[10px] font-mono uppercase tracking-widest text-bone-50/90 bg-ink-900/40 backdrop-blur px-2 py-0.5">
                        {p.category.name}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg md:text-2xl text-ink-900 leading-snug group-hover:text-brand-600 transition-colors duration-500">{p.name}</h3>
                    {p.shortDesc && <p className="mt-2 text-sm text-ink-400 line-clamp-2">{p.shortDesc}</p>}
                    {features.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-ink-400">
                        {features.slice(0, 2).map((f, fi) => (<span key={fi}>· {f}</span>))}
                      </div>
                    )}
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`shrink-0 px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-serif transition-colors ${
        active ? 'text-ink-900 bg-bone-100' : 'text-ink-400 hover:text-ink-900'
      }`}
    >
      {label}
    </Link>
  )
}
