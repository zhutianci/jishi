import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // 中性底色：偏暖的米白/石灰色（比纯白/纯灰更有质感）
        bone: {
          50:  '#fbfaf7',
          100: '#f5f3ec',
          200: '#ebe7dc',
          300: '#d8d2c2',
          400: '#aea693',
          500: '#7e7765',
        },
        ink: {
          50:  '#f5f4f1',
          100: '#e7e5e0',
          400: '#5e5b53',
          500: '#3c3a35',
          700: '#1f1d1a',
          800: '#15140f',
          900: '#0a0a08',
        },
        // 品牌色：深绛红 + 香槟金
        brand: {
          50:  '#fbf2f1',
          100: '#f6dfdb',
          200: '#ecbeb6',
          300: '#dc8e80',
          400: '#c75e4d',
          500: '#a83d2e',
          600: '#8a2f24',
          700: '#6e271f',
          800: '#5a2520',
          900: '#3d1b18',
        },
        gold: {
          400: '#c9a763',
          500: '#b08c44',
          600: '#937330',
        },
      },
      fontFamily: {
        // 无衬线（正文）
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
        // 衬线（编辑级大标题，中文走 Noto Serif SC / 思源宋体）
        serif: [
          '"Cormorant Garamond"',
          '"Source Han Serif SC"',
          '"Noto Serif SC"',
          'SimSun',
          '"宋体"',
          'serif',
        ],
        // 等宽（用于编号、刻度）
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 12vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display':    ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      animation: {
        'marquee':       'marquee 28s linear infinite',
        'marquee-slow':  'marquee 48s linear infinite',
        'fade-up':       'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'reveal':        'reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: '0', transform: 'translateY(40px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'noise':       "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        'grid-faint':  "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}

export default config
