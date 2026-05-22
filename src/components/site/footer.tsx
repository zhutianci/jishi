import Link from 'next/link'
import type { SiteSettingsMap } from '@/lib/settings'

export function Footer({ settings }: { settings: SiteSettingsMap }) {
  const companyName = settings['company.name'] || '灌云吉狮汽车饰品有限公司'
  const shortName = settings['company.shortName'] || '吉狮汽饰'
  const slogan = settings['company.slogan'] || '专注汽车内饰精工制造'
  const address = settings['company.address']
  const businessHours = settings['company.businessHours']
  const huangweiPhone = settings['contact.huangwei.phone']
  const zhusutingPhone = settings['contact.zhusuting.phone']
  const companyPhone = settings['contact.company.phone']
  const email = settings['contact.company.email']
  const icp = settings['site.icp']
  const copyright = settings['site.copyright'] || companyName

  return (
    <footer className="relative border-t border-gray-100 mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/10 to-transparent pointer-events-none" />

      <div className="container relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-lg text-white">
                吉
              </div>
              <span className="font-bold text-xl">{shortName}</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              {slogan}
            </p>
            {address && (
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <div className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">📍</span>
                  <span>{address}</span>
                </div>
                {businessHours && (
                  <div className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">🕐</span>
                    <span>{businessHours}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">产品中心</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products?cat=floormat" className="text-gray-500 hover:text-gray-900">汽车脚垫</Link></li>
              <li><Link href="/products?cat=wheelcover" className="text-gray-500 hover:text-gray-900">手缝方向盘套</Link></li>
              <li><Link href="/cases" className="text-gray-500 hover:text-gray-900">案例展示</Link></li>
              <li><Link href="/craft" className="text-gray-500 hover:text-gray-900">工艺优势</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">联系方式</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {companyPhone && <li>总机：{companyPhone}</li>}
              {huangweiPhone && <li>脚垫业务：{huangweiPhone}</li>}
              {zhusutingPhone && <li>方向盘套业务：{zhusutingPhone}</li>}
              {email && <li>邮箱：{email}</li>}
              <li className="pt-2">
                <Link href="/contact" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-600">
                  添加微信咨询 →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {copyright}. 保留所有权利.
          </p>
          <div className="flex gap-4">
            {icp && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                {icp}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
