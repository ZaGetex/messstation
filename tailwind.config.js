/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // <--- Dieser Pfad ist besonders wichtig!
  ],
  theme: {
    extend: {
      // ... deine Erweiterungen
    },
  },
  plugins: [],
}