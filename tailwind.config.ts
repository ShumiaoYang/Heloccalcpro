import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-foreground': 'rgb(var(--color-brand-foreground) / <alpha-value>)',
      },
      boxShadow: {
        glow: '0 0 25px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
