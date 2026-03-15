/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--color-primary), <alpha-value>)',
        accent: 'rgba(var(--color-accent), <alpha-value>)',
        navy: {
          DEFAULT: 'rgba(var(--color-navy), <alpha-value>)',
          dark: 'rgba(var(--color-navy-dark), <alpha-value>)',
          darker: 'rgba(var(--color-navy-darker), <alpha-value>)',
          light: 'rgba(var(--color-navy-light), <alpha-value>)',
        },
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(var(--color-primary), 0.3)',
      },
    },
  },
  plugins: [],
};