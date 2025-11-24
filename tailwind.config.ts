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
        // Primary Colors
        'mb-navy': '#2d287f',
        'mb-dark': '#243047',
        'mb-warning': '#ffc107',

        // Background Colors
        'mb-bg-light': '#f7f9fb',
        'mb-bg-white': '#ffffff',

        // Border & Gray Scale
        'mb-border-gray': '#E5E8ED',
        'mb-border-light': '#e6e8eb',
        'mb-border-card': '#ecedee',
        'mb-gray': '#6c757d',

        // Link Colors
        'mb-link-blue': '#0d6efd',

        // Social Media Colors
        'mb-facebook': '#3a5998',
        'mb-twitter': '#3f99fe',
        'mb-youtube': '#e7301a',
        'mb-linkedin': '#047bb6',
      },
      fontSize: {
        'hero': '42px',
        'h1': '32px',
        'h2': '28px',
        'h3': '24px',
        'h4': '20px',
        'base': '18px',
        'md': '15px',
        'sm': '14px',
        'xs': '12px',
      },
      spacing: {
        '50': '50px',
        '60': '60px',
      },
      borderRadius: {
        'mb': '4px',
        'mb-lg': '6px',
      },
      boxShadow: {
        'mb-hover': '0 4px 8px rgba(0, 110, 255, 0.12)',
        'mb-modal': '0 10px 40px rgba(0, 0, 0, 0.2)',
      },
      lineHeight: {
        'tight': '1.3',
        'normal': '1.4',
        'relaxed': '1.5',
      },
      fontWeight: {
        'light': '300',
        'regular': '400',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
    },
  },
  plugins: [],
}

export default config
