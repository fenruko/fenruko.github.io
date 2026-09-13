/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-1': 'float 6s ease-in-out infinite',
        'float-2': 'float 8s ease-in-out infinite',
        'float-3': 'float 10s ease-in-out infinite',
        'float-4': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(20px)' },
        },
      },
    },
  },
  plugins: [],
}
