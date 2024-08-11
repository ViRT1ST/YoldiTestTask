const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '480px',
      ...defaultTheme.screens,
    },
    extend: {
      transitionProperty: {
        height: 'height, maxHeight',
        spacing: 'margin, padding',
      }
    },
    fontFamily: {
      'opensans': ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
      'lato': ['var(--font-lato)', 'system-ui', 'sans-serif'],
      'roboto': ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
};
