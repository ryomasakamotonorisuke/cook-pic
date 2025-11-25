/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ヒューマニスティック・ミニマリズム カラーパレット
        base: '#FFFFFF',
        'base-off': '#F7F7F7',
        text: '#2C2C2C',
        'text-light': '#666666',
        'text-lighter': '#999999',
        
        // プライマリ - ナチュラルブルー
        primary: {
          DEFAULT: '#4A69BD',
          light: '#6B8CE8',
          dark: '#3A4F8F',
        },
        
        // セカンダリ - ディープグリーン
        secondary: {
          DEFAULT: '#2D8659',
          light: '#4AA876',
          dark: '#1F5C3F',
        },
        
        // アクセント - テラコッタ
        accent: {
          DEFAULT: '#E89C6D',
          light: '#F5B896',
          dark: '#D17A4A',
        },
        
        // グレースケール
        gray: {
          50: '#F7F7F7',
          100: '#E8E8E8',
          200: '#D0D0D0',
          300: '#B8B8B8',
          400: '#999999',
          500: '#666666',
          600: '#4A4A4A',
          700: '#2C2C2C',
        },
        
        // テーマ別カラー
        'system-admin': {
          primary: '#4A69BD',
          bg: '#F7F7F7',
        },
        'store-admin': {
          primary: '#2D8659',
          bg: '#F7F7F7',
        },
        user: {
          primary: '#E89C6D',
          bg: '#F7F7F7',
        },
        menu: {
          primary: '#E89C6D',
          bg: '#F7F7F7',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-jp)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        'section': '3rem',
        'element': '1.5rem',
      },
    },
  },
  plugins: [],
}
