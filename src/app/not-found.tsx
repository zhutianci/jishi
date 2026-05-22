import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold bg-gradient-to-r from-brand-400 to-gold-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-3">页面不存在</h1>
        <p className="text-gray-500 mb-8">您访问的内容可能已被移除或链接错误</p>
        <Link href="/" className="btn-primary">
          返回首页
        </Link>
      </div>
    </div>
  )
}
