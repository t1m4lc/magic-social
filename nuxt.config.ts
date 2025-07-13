import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
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
    "@nuxtjs/supabase",
    "dayjs-nuxt",
    "@unlok-co/nuxt-stripe",
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
    "/dashboard/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
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
  runtimeConfig: {
    // Private keys (only available on server-side)
    openaiApiKey: process.env.OPENAI_API_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    // Public keys (exposed to client-side)
    stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
    public: {
      stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: true,
    redirectOptions: {
      login: "/",
      callback: "/confirm",
      include: ["/dashboard(/*)?"],
      saveRedirectToCookie: true,
    },
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {},
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      options: {},
    },
  },
  app: {
    head: {
      meta: [
        { property: "og:image", content: "/thumbnails/og-image.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/thumbnails/twitter-image.png" },
      ],
    },
  },
});
