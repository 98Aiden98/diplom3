/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#e6f2ff',
          200: '#cce3ff',
          300: '#9cc9ff',
          400: '#65a9ff',
          500: '#3d88f6',
          600: '#2669db',
          700: '#1f54b2',
          800: '#21498e',
          900: '#203f73',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI Variable', 'Segoe UI', 'sans-serif'],
        body: ['IBM Plex Sans', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(25, 78, 127, 0.12)',
      },
    },
  },
  plugins: [],
}
