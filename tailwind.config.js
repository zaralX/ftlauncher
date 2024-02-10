import animationDelay from 'tailwindcss-animation-delay'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
        '3xl': '1920px'
      },
      backgroundSize: {
        '500%': '500%',
        '400%': '400%',
        '300%': '300%',
        '200%': '200%'
      },
      colors: {
        themePrimary: 'var(--primary)',
        themeSecondary: 'var(--secondary)',
        themeThirty: 'var(--thirty)',
        themeFourth: 'var(--fourth)',
        themeFifth: 'var(--fifth)',

        themeInfo: 'var(--info)',
        themeSuccess: 'var(--success)',
        themeDanger: 'var(--danger)',
        themeWarn: 'var(--warn)',

        themeText: 'var(--text)',
      },
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'opacity': 'opacity 2s ease-in-out infinite',
        'loading_screen': 'wiggle 1.6s ease-in-out infinite, opacity 2s ease-in-out infinite',
        'low_x_mover': 'xMover 3s ease-in-out infinite',
        'low_y_mover': 'yMover 3s ease-in-out infinite',
        'low_mover': 'xMover 10s ease-in-out infinite, yMover 10s ease-in-out infinite',
        'gradient': 'animatedGradient 5s infinite alternate'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        xMover: {
          '0%, 100%': { transform: 'translateX(1rem)' },
          '50%': { transform: 'translateX(-1rem)' },
        },
        yMover: {
          '0%, 100%': { transform: 'translateY(1rem)' },
          '50%': { transform: 'translateX(-1rem)' },
        },
        opacity: {
          '0%': { opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        },
        animatedGradient: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
      }
    },
  },
  plugins: [animationDelay]
}
