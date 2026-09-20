/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "drift-slow": "drift 26s ease-in-out infinite alternate",
        "drift-slower": "drift 38s ease-in-out infinite alternate-reverse",
        marquee: "marquee var(--duration, 30s) linear infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6vw, -4vh, 0) scale(1.12)" },
          "100%": { transform: "translate3d(-4vw, 5vh, 0) scale(0.95)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 1rem))" },
        },
      },
    },
  },
  plugins: [],
};
