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
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        // US Dollar Aesthetic color palette
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#16A34A', // Vibrant Dollar Green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#0B3B24', // Deep Forest Green
          950: '#052E16',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(22, 163, 74, 0.35)', // Green glow
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        dancing: ['var(--font-dancing-script)', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
