/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          100: "#e0f2ff",
          200: "#cae8ff",
          300: "#b5deff",
          400: "#96cefd",
          500: "#78bbfa",
          600: "#59a7f6",
          700: "#3892f3",
          800: "#147af3",
          900: "#0265dc",
          1000: "#0054b6",
          1100: "#004491",
          1200: "#003571",
          1300: "#002754",
        },
      },
    },
  },
  plugins: [],
};
