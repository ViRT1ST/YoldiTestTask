import defaultTheme from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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

export default config;
