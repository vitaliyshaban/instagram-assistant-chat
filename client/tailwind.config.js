const { join } = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "./app/**/*.{js,ts,jsx,tsx,mdx}"),
    join(__dirname, "./pages/**/*.{js,ts,jsx,tsx,mdx}"),
    join(__dirname, "./components/**/*.{js,ts,jsx,tsx,mdx}"),
 
    // Or if using `src` directory:
    join(__dirname, "./src/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}