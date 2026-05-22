import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = { title: '工艺优势' }

export default async function CraftPage() {
  const craftImages = await prisma.galleryImage.findMany({
    where: { category: 'craft' },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="pt-28 md:pt-32 pb-12 md:pb-20">
      <div className="container">
        <div className="max-w-3xl mb-16">
          <div className="text-brand-600 mb-2">工艺优势</div>
          <h1 className="heading-1 mb-6">每一针每一线<br />都是对品质的承诺</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            从原料筛选到成品质检，10+ 道工序，每个环节严控品质
          </p>
        </div>

        {/* 工艺流程 */}
        <section className="mb-20">
          <h2 className="heading-3 mb-10 text-center">六步制造流程</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CraftStep n="01" title="原料筛选" desc="严选优质原材料，劣质料一律不进车间" />
            <CraftStep n="02" title="精准量裁" desc="按车型 1:1 数模激光裁剪，无误差适配" />
            <CraftStep n="03" title="手工缝制" desc="方向盘套全程手缝，每米 18-22 针，紧密均匀" />
            <CraftStep n="04" title="模具压制" desc="脚垫高温高压成型，立体环绕不变形" />
            <CraftStep n="05" title="三道质检" desc="尺寸 → 外观 → 试装，三道关卡确保零瑕疵" />
            <CraftStep n="06" title="精装出厂" desc="独立包装，附使用说明，妥善发货" />
          </div>
        </section>

        {/* 工艺图片 */}
        {craftImages.length > 0 && (
          <section className="mb-20">
            <h2 className="heading-3 mb-10 text-center">工艺实拍</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {craftImages.map((img) => (
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
          </section>
        )}

        {/* 材料对比 */}
        <section>
          <h2 className="heading-3 mb-10 text-center">我们用什么材料</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <MaterialCard
              icon="🛞"
              title="脚垫材料"
              items={[
                { name: 'TPE 环保料', desc: '无异味、易清洗、耐磨耐撕扯' },
                { name: '丝圈材质', desc: '吸尘吸水，颜值与实用兼具' },
                { name: '高密度皮革', desc: '高档质感，搭配豪华内饰' },
              ]}
            />
            <MaterialCard
              icon="🎯"
              title="方向盘套材料"
              items={[
                { name: '进口头层牛皮', desc: '柔软透气，越用越有质感' },
                { name: '意大利翻毛皮', desc: '运动握感，赛道级体验' },
                { name: '碳纤维拼接', desc: '科技感强，搭配运动车型' },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function CraftStep({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute top-0 right-0 text-7xl font-bold text-gray-100 leading-none">
        {n}
      </div>
      <div className="relative">
        <div className="text-brand-600 font-mono text-sm mb-2">STEP {n}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function MaterialCard({
  icon,
  title,
  items,
}: {
  icon: string
  title: string
  items: { name: string; desc: string }[]
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border-l-2 border-brand-500/50 pl-4">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
