import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wirelink primary — orange
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Wirelink ink — slate (keeps 'secondary' alias for back-compat)
        ink: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50:  '#f8fafc',
        },
        secondary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Wirelink surfaces
        surface: {
          DEFAULT: '#ffffff',
          warm:    '#fffaf3',
          muted:   '#f8fafc',
          inset:   '#f1f5f9',
        },
        // Semantic
        success: { 50: '#ecfdf5', 500: '#10b981', 700: '#047857' },
        warn:    { 50: '#fffbeb', 500: '#f59e0b', 700: '#b45309' },
        danger:  { 50: '#fef2f2', 500: '#ef4444', 700: '#b91c1c' },
        info:    { 50: '#eff6ff', 500: '#3b82f6', 700: '#1d4ed8' },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs:   '4px',
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        '2xl':'28px',
        full: '9999px',
      },
      boxShadow: {
        xs:   '0 1px 2px rgba(15,23,42,0.04)',
        sm:   '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        md:   '0 2px 4px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)',
        lg:   '0 4px 12px rgba(15,23,42,0.05), 0 12px 28px rgba(15,23,42,0.08)',
        xl:   '0 12px 32px rgba(15,23,42,0.10), 0 24px 60px rgba(15,23,42,0.12)',
        glow: '0 0 0 4px rgba(249,115,22,0.18)',
      },
      letterSpacing: {
        tight:   '-0.01em',
        tighter: '-0.02em',
        tightest:'-0.03em',
      },
    },
  },
  plugins: [],
}

export default config
