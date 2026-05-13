/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#FBF8F4',
        ink: '#1F1B2D',
        muted: '#8B847C',
        accent: {
          mint: '#A7D7C5',
          peach: '#F4C7A1',
          lilac: '#C9B6E4',
          sky: '#A9C6E8',
          rose: '#E8B4BC',
          purple: '#6B5BD1',
          purpleSoft: '#A89AE8',
          cream: '#FDE7DB',
          blush: '#F3D5DD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(31, 27, 45, 0.12)',
        soft: '0 8px 32px -12px rgba(31, 27, 45, 0.18)',
        halo: '0 0 0 8px rgba(107, 91, 209, 0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        splashIn: {
          '0%': { opacity: '0', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        splashOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.96)' },
        },
        contentLift: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-30px)' },
        },
        titleIn: {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        blobIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '0.55', transform: 'scale(1)' },
        },
        appIn: {
          '0%': { opacity: '0', transform: 'scale(1.015)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out both',
        fadeIn: 'fadeIn 0.6s ease-out both',
        slowPulse: 'slowPulse 2.4s ease-in-out infinite',
        splashIn: 'splashIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        splashOut: 'splashOut 0.75s cubic-bezier(0.55, 0, 0.65, 1) both',
        contentLift: 'contentLift 0.7s cubic-bezier(0.55, 0, 0.65, 1) both',
        titleIn: 'titleIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        blobIn: 'blobIn 1.3s ease-out both',
        appIn: 'appIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
