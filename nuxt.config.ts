import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/scripts",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  routeRules: {
    "/": { prerender: true },
    "/pricing": { prerender: true },
    "/terms": { prerender: true },
    "/privacy": { prerender: true },
  },
});
