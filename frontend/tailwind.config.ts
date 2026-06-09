import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#E6D7C3',
          300: '#D4BFA0',
          400: '#C2A77D',
          500: '#C5A880', // Signature Luxury Gold
          600: '#A3855E',
          700: '#826543',
          800: '#61482E',
          900: '#422F1D',
        },
        luxury: {
          charcoal: '#121212',
          obsidian: '#0A0A0A',
          cream: '#FAF9F6',
          bronze: '#8C6239',
          champagne: '#F7F5F0',
          gold: '#C5A880',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
