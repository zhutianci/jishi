import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        // 品牌色：深酒红 + 香槟金（汽车后市场精品工厂调性）
        brand: {
          50:  '#fdf4f3',
          100: '#fbe5e3',
          200: '#f6c9c5',
          300: '#eea29c',
          400: '#e26c63',
          500: '#cf4a40',
          600: '#b53127',
          700: '#962b25',
          800: '#7c2925',
          900: '#682624',
        },
        gold: {
          400: '#d4a857',
          500: '#c69749',
          600: '#a87a32',
        },
        ink: {
          950: '#0a0a0b',
          900: '#111114',
          800: '#1a1a1f',
          700: '#252530',
          600: '#3a3a47',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['system-ui', '-apple-system', 'PingFang SC', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grain': "radial-gradient(ellipse at top, rgba(207,74,64,0.15), transparent 60%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
