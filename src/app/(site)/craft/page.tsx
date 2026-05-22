import { prisma } from '@/lib/prisma'
import { Reveal } from '@/components/site/reveal'
import { SectionLabel } from '@/components/site/section-label'

export const dynamic = 'force-dynamic'

export const metadata = { title: '工艺优势' }

const STEPS = [
  { n: '01', t: '严选原料', d: '只用源头核心料：意大利植鞣牛皮、TPE 食品级环保料、丝圈高密度纤维。劣质料一律不进车间。' },
  { n: '02', t: '精准量裁', d: '每款车型 1:1 数据建模，激光裁切配合人工修边。零误差贴合车身曲面。' },
  { n: '03', t: '手工缝制', d: '方向盘套全程手缝，每米 18-22 针，针距均匀紧密；线材选用日本钓鱼线，5 倍抗拉。' },
  { n: '04', t: '模具压制', d: '脚垫采用高温高压一次成型，立体环绕不变形，使用 3 年以上不塌陷。' },
  { n: '05', t: '三道质检', d: '尺寸 → 外观 → 试装，三道关卡逐件检验，瑕疵率严控 0.5% 以下。' },
  { n: '06', t: '精装出厂', d: '独立包装、附使用说明、附保养指南；顺丰发货，48 小时直达全国。' },
]

const MATERIALS = [
  {
    title: '脚垫材料',
    items: [
      { name: 'TPE 环保料', desc: '无异味、易清洗、耐磨耐撕扯' },
      { name: '丝圈材质', desc: '吸尘吸水，颜值与实用兼具' },
      { name: '高密度皮革', desc: '高档质感，搭配豪华内饰' },
    ],
  },
  {
    title: '方向盘套材料',
    items: [
      { name: '进口头层牛皮', desc: '柔软透气，越用越有质感' },
      { name: '意大利翻毛皮', desc: '运动握感，赛道级体验' },
      { name: '碳纤维拼接', desc: '科技感强，搭配运动车型' },
    ],
  },
]

export default async function CraftPage() {
  const craftImages = await prisma.galleryImage.findMany({
    where: { category: 'craft' },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <section className="pt-32 md:pt-44 pb-12 md:pb-20">
        <div className="container">
          <Reveal><SectionLabel number="04">工艺细节</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h1 className="heading-1 mt-6 md:mt-10 max-w-5xl text-balance">
              每一针每一线 <br />
              <span className="italic font-light text-brand-600">都是对品质的承诺。</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 md:mt-10 max-w-2xl text-lg md:text-xl text-ink-700 font-serif leading-relaxed">
              从原料筛选到成品质检，10+ 道工序，每个环节都有人盯着。我们相信，匠心藏在看不见的地方。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-ink-100">
        <div className="container">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-12 md:mb-16">
              <span className="inline-block w-8 h-px bg-ink-400 mr-3 align-middle" />
              制造流程 / Process
            </div>
          </Reveal>

          <div className="space-y-px bg-ink-100">
            {STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="bg-bone-50 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 px-2 md:px-6">
                  <div className="md:col-span-2 font-serif text-5xl md:text-7xl text-ink-100 leading-none">{step.n}</div>
                  <div className="md:col-span-4">
                    <h3 className="font-serif text-2xl md:text-3xl text-ink-900 mb-1">{step.t}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-ink-700 leading-relaxed text-base md:text-lg">{step.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {craftImages.length > 0 && (
        <section className="section bg-ink-900 text-bone-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="container relative">
            <Reveal>
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-bone-50/60 mb-6">
                <span className="inline-block w-8 h-px bg-bone-50/40" />
                工艺实拍 / Visual
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-bone-50 max-w-3xl text-balance mb-12 md:mb-16">
                时间能验证的 <br />
                <span className="italic font-light text-brand-300">才叫工艺。</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {craftImages.map((img) => (
                  <div key={img.id} className="aspect-square overflow-hidden bg-ink-700 group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imageUrl} alt={img.title || ''} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-6">
              <span className="inline-block w-8 h-px bg-ink-400 mr-3 align-middle" />
              用什么材料 / Materials
            </div>
            <h2 className="heading-2 max-w-3xl mb-12 md:mb-16 text-balance">
              料决定品质 <br />
              <span className="italic font-light text-brand-600">不存侥幸心理。</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-20">
            {MATERIALS.map((m, mi) => (
              <Reveal key={mi} delay={mi * 0.1}>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-8 text-ink-900">{m.title}</h3>
                  <div className="space-y-6">
                    {m.items.map((item, i) => (
                      <div key={i} className="border-t border-ink-100 pt-5">
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="font-serif text-xl text-ink-900">{item.name}</div>
                          <span className="text-xs font-mono uppercase tracking-widest text-ink-400 shrink-0">0{i + 1}</span>
                        </div>
                        <div className="text-sm text-ink-700 mt-2">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
