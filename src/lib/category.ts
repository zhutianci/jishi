/**
 * 决定分类对应的联系人 key。
 * 优先级：category.contactKey > slug 默认 > 名字关键词 > 'huangwei'
 *
 * 联系人 key 用于拼 SiteSetting 的 key：例如 'huangwei' → 'contact.huangwei.{name|phone|wechat|wechatQr}'
 */
export function getCategoryContactKey(category: {
  slug?: string | null
  name?: string | null
  contactKey?: string | null
}): string {
  if (category.contactKey) return category.contactKey

  // 按已知 slug 兜底
  if (category.slug === 'floormat') return 'huangwei'
  if (category.slug === 'wheelcover') return 'zhusuting'

  // 按名字关键词兜底
  const name = category.name || ''
  if (name.includes('脚垫')) return 'huangwei'
  if (name.includes('方向盘')) return 'zhusuting'

  // 默认（避免页面没有联系人）
  return 'huangwei'
}

/** 获取该联系人显示名（用于"业务"标签） */
export function getContactProductLine(contactKey: string): string {
  if (contactKey === 'huangwei') return '脚垫'
  if (contactKey === 'zhusuting') return '方向盘套'
  return ''
}
