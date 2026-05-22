import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { SectionLabel } from '@/components/site/section-label'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return { title: `关于我们 - ${s['company.name'] || '灌云吉狮汽车饰品'}` }
}

export default async function AboutPage() {
  const settings = await getSettings()
  const [factoryImages, certImages, teamImages] = await Promise.all([
    prisma.galleryImage.findMany({ where: { category: 'factory' }, orderBy: { sortOrder: 'asc' } }),
    prisma.galleryImage.findMany({ where: { category: 'certificate' }, orderBy: { sortOrder: 'asc' } }),
    prisma.galleryImage.findMany({ where: { category: 'team' }, orderBy: { sortOrder: 'asc' } }),
  ])

  const name = settings['company.name'] || '灌云吉狮汽车饰品有限公司'
  const intro = settings['company.intro']
  const founded = settings['company.foundedYear']
  const slogan = settings['company.slogan']

  return (
    <div>
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 relative">
        <div className="container">
          <Reveal><SectionLabel number="01">关于我们</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h1 className="heading-1 mt-6 md:mt-10 max-w-5xl text-balance">
              {name}
              {slogan && (<><br /><span className="italic font-light text-brand-600">{slogan}</span></>)}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-3">
              <div className="text-xs font-mono uppercase tracking-widest text-ink-400">品牌故事 / Story</div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-9">
              {intro ? (
                <div className="space-y-6 font-serif text-xl md:text-2xl text-ink-700 leading-[1.75] max-w-4xl">
                  {intro.split('\n').filter(Boolean).map((p, i) => (<p key={i}>{p}</p>))}
                </div>
              ) : (
                <p className="text-ink-400 italic">公司简介尚未填写，请在后台 → 站点设置 → 公司信息中编辑</p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-bone-100 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply pointer-events-none" />
        <div className="container relative">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {[
                { num: founded ? `${new Date().getFullYear() - parseInt(founded)}+` : '04+', label: '年制造经验' },
                { num: '02', label: '主营产品线' },
                { num: '100%', label: '源头工厂' },
                { num: '24h', label: '响应速度' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink-900 tracking-tight">{stat.num}</div>
                  <div className="mt-3 text-xs font-mono uppercase tracking-widest text-ink-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {factoryImages.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal>
              <SectionLabel number="02">工厂实景</SectionLabel>
              <h2 className="heading-2 mt-6 max-w-2xl text-balance">
                眼见为实 <br /><span className="italic font-light text-brand-600">欢迎实地参观。</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}><GalleryGrid images={factoryImages} /></Reveal>
          </div>
        </section>
      )}

      {teamImages.length > 0 && (
        <section className="section bg-bone-100 border-y border-ink-100">
          <div className="container">
            <Reveal>
              <SectionLabel number="03">团队风采</SectionLabel>
              <h2 className="heading-2 mt-6 text-balance">
                匠人之手 <br /><span className="italic font-light text-brand-600">温度可见。</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}><GalleryGrid images={teamImages} /></Reveal>
          </div>
        </section>
      )}

      {certImages.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal>
              <SectionLabel number="04">资质荣誉</SectionLabel>
              <h2 className="heading-2 mt-6 text-balance">
                每一份证书 <br /><span className="italic font-light text-brand-600">都是一份承诺。</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}><GalleryGrid images={certImages} /></Reveal>
          </div>
        </section>
      )}
    </div>
  )
}

function GalleryGrid({ images }: { images: { id: number; imageUrl: string; title: string | null }[] }) {
  return (
    <div className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {images.map((img) => (
        <div key={img.id} className="aspect-square overflow-hidden bg-ink-100 group relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.imageUrl} alt={img.title || ''} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        </div>
      ))}
    </div>
  )
}
