import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// seed 在 node 环境直接运行（非 Next standalone），bcryptjs 可正常使用
const DEFAULT_ACCOUNTS = [
  { email: 'admin@ji-shi.com',     password: 'admin123',     name: '管理员', role: 'ADMIN' as const },
  { email: 'huangwei@ji-shi.com',  password: 'huangwei123',  name: '黄威',   role: 'FLOORMAT_MGR' as const },
  { email: 'zhusuting@ji-shi.com', password: 'zhusuting123', name: '朱苏婷', role: 'WHEELCOVER_MGR' as const },
]

async function main() {
  // ============== 默认账号 ==============
  for (const a of DEFAULT_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(a.password, 10)
    await prisma.user.upsert({
      where: { email: a.email },
      update: {}, // 已存在的账号不覆盖（避免修改用户改过的密码）
      create: {
        email: a.email,
        passwordHash,
        name: a.name,
        role: a.role,
      },
    })
  }
  console.log('✓ 默认账号已创建')

  // ============== 产品分类（固定两个） ==============
  await prisma.category.upsert({
    where: { slug: 'floormat' },
    update: {},
    create: {
      slug: 'floormat',
      name: '汽车脚垫',
      subtitle: '全包围设计 · 360°环保贴合 · 全车型适配',
      sortOrder: 1,
    },
  })
  await prisma.category.upsert({
    where: { slug: 'wheelcover' },
    update: {},
    create: {
      slug: 'wheelcover',
      name: '手缝方向盘套',
      subtitle: '手工缝制 · 进口皮料 · 量身定制',
      sortOrder: 2,
    },
  })
  console.log('✓ 产品分类已创建')

  // ============== 站点初始设置 ==============
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
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('✓ 初始站点设置已写入')

  // ============== 默认 Hero 轮播（占位） ==============
  const heroCount = await prisma.heroSlide.count()
  if (heroCount === 0) {
    await prisma.heroSlide.create({
      data: {
        title: '源头工厂 · 精工品质',
        subtitle: '专业汽车脚垫与手缝方向盘套源头制造商，欢迎实地参观',
        imageUrl: '', // 由后台上传
        ctaText: '查看产品',
        ctaLink: '/products',
        sortOrder: 0,
        active: true,
      },
    })
    console.log('✓ 默认 Hero 已创建（请在后台上传背景图）')
  }

  console.log('')
  console.log('=========================================')
  console.log('Seed 完成！默认账号：')
  console.log('  超管:        admin@ji-shi.com / admin123')
  console.log('  脚垫负责人:  huangwei@ji-shi.com / huangwei123')
  console.log('  方向盘套:    zhusuting@ji-shi.com / zhusuting123')
  console.log('⚠️  首次登录后请立即在「修改密码」中更改密码')
  console.log('=========================================')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
