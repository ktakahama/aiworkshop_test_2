/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)',
      },
      colors: {
        'metallic': {
          light: '#F5F5F7',
          DEFAULT: '#E2E2E7',
          dark: '#C5C5C9',
        }
      }
    },
  },
  plugins: [],
} 