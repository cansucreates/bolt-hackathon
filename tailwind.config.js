/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'kawaii-pink': '#FFE5EC',
        'kawaii-pink-dark': '#FFB6D9',
        'kawaii-blue': '#E0F4FF',
        'kawaii-blue-dark': '#B6E6FF',
        'kawaii-green': '#D8FFE6',
        'kawaii-green-dark': '#B6FFDA',
        'kawaii-yellow': '#FFF8D6',
        'kawaii-yellow-dark': '#E6E6FA', // Changed to soft pastel lavender
        'kawaii-purple': '#EBD6FF',
        'kawaii-purple-dark': '#DEB6FF',
        'kawaii-coral': '#FFDEDE',
        'kawaii-mint': '#B6FFDA',
        'kawaii-lavender': '#F0F0FF', // Softer, lighter pastel lavender
        'kawaii-lavender-dark': '#D8D8FF', // Softer pastel lavender for contrast
        'kawaii-periwinkle': '#C7D2FE',
        'kawaii-periwinkle-dark': '#8B5CF6',
      },
      fontFamily: {
        'kawaii': ['Nunito', 'Comic Sans MS', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'kawaii': '1.5rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          '0%': { opacity: 0, transform: 'scale(0)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0)' },
        },
      },
      cursor: {
        'paw': 'url("/src/assets/paw-cursor.png"), pointer',
      },
    },
  },
  plugins: [],
};