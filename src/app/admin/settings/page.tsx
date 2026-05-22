'use client'

import { useEffect, useState } from 'react'
import { ImageUploader } from '@/components/image-uploader'

type Setting = {
  key: string
  value: string
  type: string
  group: string
  label: string | null
}

// 预定义的设置项（即使数据库还没有也展示）
const PRESET: Array<Omit<Setting, 'value'> & { value: string; help?: string }> = [
  // 公司信息
  { key: 'company.name', value: '灌云吉狮汽车饰品有限公司', type: 'text', group: 'company', label: '公司全称' },
  { key: 'company.shortName', value: '吉狮汽饰', type: 'text', group: 'company', label: '公司简称' },
  { key: 'company.slogan', value: '专注汽车内饰精工制造', type: 'text', group: 'company', label: '品牌口号' },
  { key: 'company.intro', value: '', type: 'richtext', group: 'company', label: '公司简介（关于我们）', help: '会显示在"关于我们"页面，建议 200-500 字' },
  { key: 'company.foundedYear', value: '', type: 'text', group: 'company', label: '成立年份' },
  { key: 'company.address', value: '江苏省连云港市灌云县', type: 'text', group: 'company', label: '公司地址' },
  { key: 'company.businessHours', value: '周一至周日 8:30 - 18:00', type: 'text', group: 'company', label: '营业时间' },

  // 联系方式 - 黄威（脚垫）
  { key: 'contact.huangwei.name', value: '黄威', type: 'text', group: 'contact', label: '脚垫负责人姓名' },
  { key: 'contact.huangwei.phone', value: '', type: 'text', group: 'contact', label: '黄威 手机' },
  { key: 'contact.huangwei.wechat', value: '', type: 'text', group: 'contact', label: '黄威 微信号' },
  { key: 'contact.huangwei.wechatQr', value: '', type: 'image', group: 'contact', label: '黄威 微信二维码' },

  // 联系方式 - 朱苏婷（方向盘套）
  { key: 'contact.zhusuting.name', value: '朱苏婷', type: 'text', group: 'contact', label: '方向盘套负责人姓名' },
  { key: 'contact.zhusuting.phone', value: '', type: 'text', group: 'contact', label: '朱苏婷 手机' },
  { key: 'contact.zhusuting.wechat', value: '', type: 'text', group: 'contact', label: '朱苏婷 微信号' },
  { key: 'contact.zhusuting.wechatQr', value: '', type: 'image', group: 'contact', label: '朱苏婷 微信二维码' },

  // 公司通用联系方式
  { key: 'contact.company.phone', value: '', type: 'text', group: 'contact', label: '公司总机' },
  { key: 'contact.company.email', value: '', type: 'text', group: 'contact', label: '公司邮箱' },

  // SEO
  { key: 'seo.title', value: '灌云吉狮汽车饰品有限公司 - 汽车脚垫、手缝方向盘套源头工厂', type: 'text', group: 'seo', label: 'SEO 标题' },
  { key: 'seo.description', value: '专业生产汽车脚垫、手缝方向盘套，源头工厂，品质保证。', type: 'text', group: 'seo', label: 'SEO 描述' },
  { key: 'seo.keywords', value: '汽车脚垫,手缝方向盘套,汽车饰品,灌云吉狮,汽车内饰', type: 'text', group: 'seo', label: 'SEO 关键词' },

  // 备案
  { key: 'site.icp', value: '', type: 'text', group: 'site', label: 'ICP 备案号', help: '如：苏ICP备XXXXXXXX号' },
  { key: 'site.copyright', value: '灌云吉狮汽车饰品有限公司', type: 'text', group: 'site', label: '页脚版权署名' },
]

const GROUP_LABELS: Record<string, string> = {
  company: '公司信息',
  contact: '联系方式',
  seo: 'SEO 设置',
  site: '站点其他',
}

const GROUP_ORDER = ['company', 'contact', 'seo', 'site']

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [activeGroup, setActiveGroup] = useState('company')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string> = {}
        for (const s of d.settings || []) map[s.key] = s.value
        // 用预设填充未设置项
        for (const p of PRESET) {
          if (!(p.key in map)) map[p.key] = p.value
        }
        setSettings(map)
        setLoading(false)
      })
  }, [])

  async function save() {
    setSaving(true)
    setSavedMsg(null)
    try {
      const payload = {
        settings: PRESET.map((p) => ({
          key: p.key,
          value: settings[p.key] ?? '',
          type: p.type,
          group: p.group,
          label: p.label,
        })),
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.error || '保存失败')
      }
      setSavedMsg('已保存')
      setTimeout(() => setSavedMsg(null), 2500)
    } catch (e) {
      setSavedMsg(e instanceof Error ? e.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-white/40">加载中...</div>

  const groupedPreset: Record<string, typeof PRESET> = {}
  for (const p of PRESET) {
    if (!groupedPreset[p.group]) groupedPreset[p.group] = []
    groupedPreset[p.group].push(p)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">站点设置</h1>
        <p className="text-sm text-white/40 mt-1">公司信息、联系方式、SEO 等全站设置</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 overflow-x-auto">
        {GROUP_ORDER.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeGroup === g
                ? 'border-brand-500 text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <div className="card space-y-5">
        {groupedPreset[activeGroup]?.map((p) => {
          const value = settings[p.key] ?? ''
          return (
            <div key={p.key}>
              <label className="label">
                {p.label}
                {p.help && <span className="ml-2 text-xs text-white/30 font-normal">{p.help}</span>}
              </label>
              {p.type === 'image' ? (
                <ImageUploader
                  value={value}
                  onChange={(url) => setSettings({ ...settings, [p.key]: url })}
                  aspect="square"
                  className="max-w-[200px]"
                />
              ) : p.type === 'richtext' ? (
                <textarea
                  rows={6}
                  className="input resize-y"
                  value={value}
                  onChange={(e) => setSettings({ ...settings, [p.key]: e.target.value })}
                />
              ) : (
                <input
                  type="text"
                  className="input"
                  value={value}
                  onChange={(e) => setSettings({ ...settings, [p.key]: e.target.value })}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 sticky bottom-4 bg-ink-950/95 backdrop-blur p-4 rounded-xl border border-white/10">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? '保存中...' : '保存全部设置'}
        </button>
        {savedMsg && <span className="text-sm text-green-400">{savedMsg}</span>}
      </div>
    </div>
  )
}
