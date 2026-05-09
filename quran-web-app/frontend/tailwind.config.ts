import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fbf7ef',
          100: '#f5ead7',
          200: '#ead2aa',
          300: '#ddb675',
          400: '#c9953f',
          500: '#b37b24',
          600: '#8c611d',
          700: '#6f4d1b',
          800: '#4d3616',
          900: '#32230f'
        },
        night: '#0b1020'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(179, 123, 36, 0.22)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(217, 181, 124, 0.22), transparent 55%)'
      }
    }
  },
  plugins: []
};

export default config;