// Pure-JS seed runnable in production docker container.
// Uses runtime deps only (@prisma/client + bcryptjs are in dependencies).
// 与 seed.ts 内容等价，仅为了让 docker 容器无需 tsx 即可运行。

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_ACCOUNTS = [
  { email: 'admin@ji-shi.com',     password: 'admin123',     name: '管理员', role: 'ADMIN' },
  { email: 'huangwei@ji-shi.com',  password: 'huangwei123',  name: '黄威',   role: 'FLOORMAT_MGR' },
  { email: 'zhusuting@ji-shi.com', password: 'zhusuting123', name: '朱苏婷', role: 'WHEELCOVER_MGR' },
]

async function main() {
  for (const a of DEFAULT_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(a.password, 10)
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { email: a.email, passwordHash, name: a.name, role: a.role },
    })
  }
  console.log('✓ Default accounts created')

  await prisma.category.upsert({
    where: { slug: 'floormat' },
    update: {},
    create: { slug: 'floormat', name: '汽车脚垫', subtitle: '全包围设计 · 360°环保贴合 · 全车型适配', sortOrder: 1 },
  })
  await prisma.category.upsert({
    where: { slug: 'wheelcover' },
    update: {},
    create: { slug: 'wheelcover', name: '手缝方向盘套', subtitle: '手工缝制 · 进口皮料 · 量身定制', sortOrder: 2 },
  })
  console.log('✓ Categories created')

  const initialSettings = [
    { key: 'company.name',          value: '灌云吉狮汽车饰品有限公司',           type: 'text',     group: 'company', label: '公司全称' },
    { key: 'company.shortName',     value: '吉狮汽饰',                            type: 'text',     group: 'company', label: '公司简称' },
    { key: 'company.slogan',        value: '专注汽车内饰精工制造',                type: 'text',     group: 'company', label: '品牌口号' },
    { key: 'company.address',       value: '江苏省连云港市灌云县',                 type: 'text',     group: 'company', label: '公司地址' },
    { key: 'company.businessHours', value: '周一至周日 8:30 - 18:00',             type: 'text',     group: 'company', label: '营业时间' },
    { key: 'contact.huangwei.name',  value: '黄威',   type: 'text', group: 'contact', label: '脚垫负责人姓名' },
    { key: 'contact.zhusuting.name', value: '朱苏婷', type: 'text', group: 'contact', label: '方向盘套负责人姓名' },
    { key: 'seo.title',       value: '灌云吉狮汽车饰品有限公司 - 汽车脚垫、手缝方向盘套源头工厂', type: 'text', group: 'seo', label: 'SEO 标题' },
    { key: 'seo.description', value: '专业生产汽车脚垫、手缝方向盘套，源头工厂，品质保证。',     type: 'text', group: 'seo', label: 'SEO 描述' },
    { key: 'seo.keywords',    value: '汽车脚垫,手缝方向盘套,汽车饰品,灌云吉狮',                  type: 'text', group: 'seo', label: 'SEO 关键词' },
    { key: 'site.copyright', value: '灌云吉狮汽车饰品有限公司', type: 'text', group: 'site', label: '版权署名' },
  ]
  for (const s of initialSettings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✓ Site settings written')

  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.create({
      data: {
        title: '源头工厂 · 精工品质',
        subtitle: '专业汽车脚垫与手缝方向盘套源头制造商，欢迎实地参观',
        imageUrl: '',
        ctaText: '查看产品',
        ctaLink: '/products',
        sortOrder: 0,
        active: true,
      },
    })
    console.log('✓ Default hero slide created (upload image in admin)')
  }

  console.log('\n=========================================')
  console.log('Seed done! Default accounts:')
  console.log('  Admin:     admin@ji-shi.com / admin123')
  console.log('  Floormat:  huangwei@ji-shi.com / huangwei123')
  console.log('  Wheel:     zhusuting@ji-shi.com / zhusuting123')
  console.log('⚠️  Change passwords immediately after first login!')
  console.log('=========================================')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
