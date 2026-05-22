import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import type { Metadata } from 'next'

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
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="text-brand-600 mb-3">关于我们</div>
            <h1 className="heading-1 mb-6">{name}</h1>
            {slogan && <p className="text-2xl text-gray-600">{slogan}</p>}
          </div>
        </div>
      </section>

      {/* 简介 */}
      {intro && (
        <section className="pb-20">
          <div className="container">
            <div className="card max-w-4xl mx-auto">
              <div className="prose max-w-none">
                {intro.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed text-lg mb-4">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {!intro && (
        <section className="pb-20">
          <div className="container">
            <div className="card max-w-4xl mx-auto text-center py-16">
              <p className="text-gray-500">
                公司简介尚未填写，请在后台 → 站点设置 → 公司信息中编辑
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 数据 */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Stat number={founded ? `${new Date().getFullYear() - parseInt(founded)}+` : '多年'} label="行业经验" />
            <Stat number="2" label="主营产品线" />
            <Stat number="100%" label="源头工厂" />
            <Stat number="24h" label="响应速度" />
          </div>
        </div>
      </section>

      {/* 工厂相册 */}
      {factoryImages.length > 0 && (
        <section className="pb-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">工厂实景</h2>
              <p className="text-gray-500">真实的生产环境，欢迎实地参观</p>
            </div>
            <GalleryGrid images={factoryImages} />
          </div>
        </section>
      )}

      {/* 团队 */}
      {teamImages.length > 0 && (
        <section className="pb-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">团队风采</h2>
            </div>
            <GalleryGrid images={teamImages} />
          </div>
        </section>
      )}

      {/* 资质 */}
      {certImages.length > 0 && (
        <section className="pb-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">资质荣誉</h2>
            </div>
            <GalleryGrid images={certImages} />
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="card text-center">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-400 to-gold-500 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-sm text-gray-500 mt-2">{label}</div>
    </div>
  )
}

function GalleryGrid({ images }: { images: { id: number; imageUrl: string; title: string | null }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img) => (
        <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.imageUrl}
            alt={img.title || ''}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  )
}
