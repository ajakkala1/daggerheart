import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./module/sheets/**/*.{svelte,js,ts,mjs}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    prefix: "daisy",
  },
};
