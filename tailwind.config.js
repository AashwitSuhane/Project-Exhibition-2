/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          50:  '#f2f2f7',
          100: '#e4e4ed',
          200: '#c9c9dc',
          300: '#a8a8c6',
          400: '#8686ae',
          500: '#636296',
          600: '#4d4c78',
          700: '#3a3960',
          800: '#24234a',
          900: '#131230',
          950: '#080815',
        },
        neon: {
          300: '#d4ff47',
          400: '#bfff00',
          500: '#a3d900',
        },
        ember: { 400: '#ff7043', 500: '#f4511e' },
        aqua:  { 400: '#26c6da', 500: '#00acc1' },
        rose:  { 400: '#f06292', 500: '#e91e8c' },
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out both',
        'slide-up':   'slideUp 0.35s ease-out both',
        'slide-in-r': 'slideInRight 0.3s ease-out both',
        'scale-in':   'scaleIn 0.25s ease-out both',
        'shimmer':    'shimmer 1.8s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:      { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:      { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 1 } },
        float:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glowPulse:    { '0%,100%': { boxShadow: '0 0 0 0 rgba(191,255,0,0.25)' }, '50%': { boxShadow: '0 0 24px 6px rgba(191,255,0,0.1)' } },
      },
      boxShadow: {
        'neon-sm': '0 0 12px rgba(191,255,0,0.3)',
        'neon-md': '0 0 24px rgba(191,255,0,0.25)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
