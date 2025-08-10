/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0c0f",
        panel: "#0e1015",
        panel2: "#12141b",
        border: "#1d2130",
        text: "#e6e7eb",
        muted: "#9aa3b2",
        gold400: "#f5d47a",
        gold500: "#f1c550",
        gold600: "#d6ab3a",
        glow: "rgba(241,197,80,0.25)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(180deg, rgba(241,197,80,0.08), rgba(0,0,0,0))",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(241,197,80,0.25)",
      }
    },
  },
  plugins: [],
};
