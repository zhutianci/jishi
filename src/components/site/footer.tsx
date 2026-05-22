import Link from 'next/link'
import type { SiteSettingsMap } from '@/lib/settings'
import { Marquee } from '@/components/site/marquee'

export function Footer({ settings }: { settings: SiteSettingsMap }) {
  const companyName = settings['company.name'] || '灌云吉狮汽车饰品有限公司'
  const slogan = settings['company.slogan'] || '一针一线 · 精工于物'
  const address = settings['company.address']
  const businessHours = settings['company.businessHours']
  const huangweiPhone = settings['contact.huangwei.phone']
  const huangweiWechat = settings['contact.huangwei.wechat']
  const zhusutingPhone = settings['contact.zhusuting.phone']
  const zhusutingWechat = settings['contact.zhusuting.wechat']
  const email = settings['contact.company.email']
  const icp = settings['site.icp']
  const copyright = settings['site.copyright'] || companyName

  return (
    <footer className="bg-ink-900 text-bone-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />

      {/* Marquee 大字 */}
      <div className="border-b border-bone-50/10 py-6 md:py-10 overflow-hidden relative">
        <Marquee
          items={Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-bone-50/70 px-8">
              {slogan}
            </span>
          ))}
          separator={<span className="text-brand-300 text-4xl sm:text-6xl md:text-7xl lg:text-8xl mx-8">·</span>}
          speed="slow"
        />
      </div>

      <div className="container relative pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-5">
            <div className="font-serif text-3xl md:text-4xl tracking-tight mb-4 text-bone-50">
              吉狮汽饰
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-bone-50/50 mb-6">
              Guanyun · Jiangsu · China
            </div>
            <p className="text-bone-100/70 leading-relaxed max-w-md">
              {companyName} —— 我们相信，汽车的内饰，应该和它的主人一样有性格。
            </p>
            {address && (
              <div className="mt-8 space-y-2 text-sm text-bone-100/60">
                <div>{address}</div>
                {businessHours && <div>{businessHours}</div>}
                {email && <a href={`mailto:${email}`} className="block text-link">{email}</a>}
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-mono uppercase tracking-widest text-bone-50/40 mb-5">
              导航 / Sitemap
            </div>
            <ul className="space-y-3 text-base">
              <li><Link href="/products" className="text-link hover:text-bone-50">产品中心</Link></li>
              <li><Link href="/cases" className="text-link hover:text-bone-50">真实案例</Link></li>
              <li><Link href="/craft" className="text-link hover:text-bone-50">工艺细节</Link></li>
              <li><Link href="/about" className="text-link hover:text-bone-50">关于我们</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-mono uppercase tracking-widest text-bone-50/40 mb-5">
              业务联系 / Contact
            </div>
            <div className="space-y-5">
              <div>
                <div className="text-sm text-bone-50/50 mb-1">脚垫业务</div>
                <div className="font-serif text-xl">黄威</div>
                {huangweiPhone && <a href={`tel:${huangweiPhone}`} className="text-sm text-bone-100/70 text-link">{huangweiPhone}</a>}
                {huangweiWechat && <div className="text-xs text-bone-50/40 mt-0.5">微信 {huangweiWechat}</div>}
              </div>
              <div>
                <div className="text-sm text-bone-50/50 mb-1">方向盘套业务</div>
                <div className="font-serif text-xl">朱苏婷</div>
                {zhusutingPhone && <a href={`tel:${zhusutingPhone}`} className="text-sm text-bone-100/70 text-link">{zhusutingPhone}</a>}
                {zhusutingWechat && <div className="text-xs text-bone-50/40 mt-0.5">微信 {zhusutingWechat}</div>}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-bone-50 hover:gap-3 transition-all duration-500"
              >
                查看全部联系方式
                <span className="block w-8 h-px bg-bone-50" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-20 pt-6 border-t border-bone-50/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-bone-50/40">
          <div>© {new Date().getFullYear()} {copyright}.</div>
          <div className="flex gap-6 items-center flex-wrap">
            {icp && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {icp}
              </a>
            )}
            <span>Designed in 灌云 · Built with care</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
