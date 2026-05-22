import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export type SiteSettingsMap = Record<string, string>

export const getSettings = cache(async (): Promise<SiteSettingsMap> => {
  const rows = await prisma.siteSetting.findMany()
  const map: SiteSettingsMap = {}
  for (const r of rows) map[r.key] = r.value
  return map
})

export function getSetting(map: SiteSettingsMap, key: string, fallback = ''): string {
  return map[key] || fallback
}
