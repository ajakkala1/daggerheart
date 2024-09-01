/** @type {import('tailwindcss').Config} */
export default {
  content: ["./module/sheets/**/*.{svelte,js,ts,mjs}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    prefix: "daisy-",
    logs: true,
  },
};
