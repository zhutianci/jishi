import { getSettings } from '@/lib/settings'
import { ContactBlock } from '../_components/contact-block'

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
    <div className="pt-32 pb-20">
      <div className="container">
        <div className="text-center mb-16">
          <div className="text-brand-600 mb-2">联系我们</div>
          <h1 className="heading-1 mb-6">期待与您合作</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            添加对应业务的微信，1 分钟响应，专业方案当天给出
          </p>
        </div>

        {/* 两个负责人 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <ContactBlock
            settings={settings}
            prefix="contact.huangwei"
            productLine="脚垫"
          />
          <ContactBlock
            settings={settings}
            prefix="contact.zhusuting"
            productLine="方向盘套"
          />
        </div>

        {/* 公司信息 */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h3 className="font-semibold text-xl mb-6">公司信息</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <InfoRow icon="🏢" label="公司全称" value={companyName} />
              {address && <InfoRow icon="📍" label="公司地址" value={address} />}
              {businessHours && <InfoRow icon="🕐" label="营业时间" value={businessHours} />}
              {phone && <InfoRow icon="📞" label="公司总机" value={phone} link={`tel:${phone}`} />}
              {email && <InfoRow icon="✉️" label="公司邮箱" value={email} link={`mailto:${email}`} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, link }: { icon: string; label: string; value: string; link?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-gray-900 ml-7">
        {link ? <a href={link} className="hover:text-brand-600">{value}</a> : value}
      </div>
    </div>
  )
}
