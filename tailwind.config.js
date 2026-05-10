/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0891B2",
          green: "#16A34A",
          amber: "#D97706",
          dark: "#1A1A2E",
        },
      },
      fontSize: {
        base: ["18px", { lineHeight: "1.8" }],
      },
      minHeight: {
        touch: "56px",
      },
    },
  },
  plugins: [],
};

