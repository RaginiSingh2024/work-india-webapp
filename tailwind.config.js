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
          50:  '#f5fbee',
          100: '#e8f6d3',
          200: '#cfecaa',
          300: '#aedd78',
          400: '#8fcc4e',
          500: '#72b830',
          600: '#5a9624',
          700: '#44731a',
          800: '#2f5112',
          900: '#1c3209',
        },
        accent: {
          400: '#aedd78',
          500: '#72b830',
          600: '#5a9624',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #5a9624 0%, #72b830 50%, #aedd78 100%)',
        'card-gradient': 'linear-gradient(135deg, #aedd78 0%, #72b830 100%)',
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
