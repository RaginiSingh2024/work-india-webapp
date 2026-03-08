/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d1fc',
          400: '#61b6f9',
          500: '#3b97f5',
          600: '#2478ea',
          700: '#1c63d8',
          800: '#1d4faf',
          900: '#1e3f8a',
        },
        accent: {
          400: '#93d1fc',
          500: '#3b97f5',
          600: '#2478ea',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1c63d8 0%, #3b97f5 50%, #93d1fc 100%)',
        'card-gradient': 'linear-gradient(135deg, #93d1fc 0%, #3b97f5 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
