import Link from 'next/link'

type Props = {
  slug: string
  name: string
  subtitle: string
  coverUrl: string | null
  count: number
}

export function ProductLineCard({ slug, name, subtitle, coverUrl, count }: Props) {
  const icon = slug === 'floormat' ? '🚗' : slug === 'wheelcover' ? '🎯' : '✨'
  return (
    <Link
      href={`/products?cat=${slug}`}
      className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-900 block text-white"
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center">
          <span className="text-9xl opacity-20">{icon}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
        <div className="text-sm text-brand-300 mb-2">{count} 款产品</div>
        <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white">{name}</h3>
        {subtitle && <p className="text-white/75 mb-4 max-w-md">{subtitle}</p>}
        <span className="inline-flex items-center gap-2 text-brand-300 group-hover:gap-3 transition-all">
          查看产品 <span>→</span>
        </span>
      </div>
    </Link>
  )
}
