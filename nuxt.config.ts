import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  $production: {
    scripts: {
      registry: {
        googleAnalytics: {
          id: "G-53HG2125ED",
        },
      },
    },
  },
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
  image: {
    format: ["webp", "avif", "jpeg"],
    quality: 85,
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    providers: {
      pravatar: {
        provider: "ipx",
        options: {
          baseURL: "https://i.pravatar.cc/",
        },
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  experimental: {
    payloadExtraction: false,
  },
  features: {
    inlineStyles: false,
  },
});
