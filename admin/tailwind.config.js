/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          bg: "#101832",
          sidebar: "#111936",
          card: "#1a2240",
          border: "#303750",
          active: "#211D5C",
        },
        brand: {
          purple: "#6C4DFF",
          text: "#D7DAEA",
          muted: "#9299B5",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
