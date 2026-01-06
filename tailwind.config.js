/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neue Farbpalette
        primary: {
          50: '#f7fcfa',
          100: '#a5bad7',
          200: '#485c8c',
          300: '#192f61',
          400: '#123a98',
          500: '#042061',
          600: '#011541',
          700: '#011541',
          800: '#011541',
          900: '#011541',
        },
        // Zusätzliche Farben für verschiedene Zwecke
        accent: {
          light: '#f7fcfa',
          medium: '#a5bad7',
          dark: '#485c8c',
        },
        background: {
          light: '#f7fcfa',
          dark: '#011541',
        },
        text: {
          primary: '#011541',
          secondary: '#042061',
          light: '#f7fcfa',
        }
      },
    },
  },
  plugins: [],
}