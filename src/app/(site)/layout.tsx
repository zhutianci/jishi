import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { getSettings } from '@/lib/settings'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  )
}
