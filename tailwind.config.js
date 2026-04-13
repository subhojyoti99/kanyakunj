/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Scan the app folder
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scan the components folder
    "./*.{js,ts,jsx,tsx,mdx}",               // Scan root files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2C1810',
          accent: '#B8860B',
          soft: '#F9F5F0',
          muted: '#8B7355',
          rose: '#C8536A',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}