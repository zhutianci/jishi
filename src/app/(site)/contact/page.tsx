import { getSettings } from '@/lib/settings'
import { ContactBlock } from '../_components/contact-block'
import { Reveal } from '@/components/site/reveal'
import { SectionLabel } from '@/components/site/section-label'

export const dynamic = 'force-dynamic'

export const metadata = { title: '联系我们' }

export default async function ContactPage() {
  const settings = await getSettings()
  const companyName = settings['company.name'] || '灌云吉狮汽车饰品有限公司'
  const address = settings['company.address']
  const businessHours = settings['company.businessHours']
  const phone = settings['contact.company.phone']
  const email = settings['contact.company.email']

  return (
    <div>
      <section className="pt-32 md:pt-44 pb-12 md:pb-20">
        <div className="container">
          <Reveal><SectionLabel number="06">联系合作</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h1 className="heading-1 mt-6 md:mt-10 max-w-5xl text-balance">
              期待与您 <br />
              <span className="italic font-light text-brand-600">下一段故事。</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 md:mt-10 max-w-2xl text-lg md:text-xl text-ink-700 font-serif leading-relaxed">
              请加对应业务的微信，1 分钟响应，专业方案当天给出。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-32 border-t border-ink-100">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-100">
            <Reveal>
              <div className="bg-bone-50 p-8 md:p-12">
                <ContactBlock settings={settings} prefix="contact.huangwei" productLine="脚垫" productLabel="01 / 汽车脚垫" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-bone-50 p-8 md:p-12">
                <ContactBlock settings={settings} prefix="contact.zhusuting" productLine="方向盘套" productLabel="02 / 手缝方向盘套" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-900 text-bone-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="container relative">
          <Reveal>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-bone-50/60 mb-6">
              <span className="inline-block w-8 h-px bg-bone-50/40" />
              <span className="text-bone-50">07</span>
              <span className="text-bone-50/30">/</span>
              <span>公司信息</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-bone-50 max-w-3xl mb-12 md:mb-16 text-balance">{companyName}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-4xl">
              {address && <InfoRow label="地址" value={address} />}
              {businessHours && <InfoRow label="营业时间" value={businessHours} />}
              {phone && <InfoRow label="公司总机" value={phone} link={`tel:${phone}`} />}
              {email && <InfoRow label="邮箱" value={email} link={`mailto:${email}`} />}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-bone-50/40 mb-3">{label}</div>
      <div className="font-serif text-xl md:text-2xl text-bone-50">
        {link ? <a href={link} className="text-link">{value}</a> : value}
      </div>
    </div>
  )
}
