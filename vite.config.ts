import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [svelte()],

  build: {

    minify: "terser",

    lib: {"entry":"module/main.ts","formats":["iife"],

      name: "app",fileName: "main.mjs",},

    watch: {

      buildDelay: 3000

    }

  },

});
