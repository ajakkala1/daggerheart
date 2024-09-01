/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.svelte",
    "./module/sheets/**/*.{svelte,js,ts,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
