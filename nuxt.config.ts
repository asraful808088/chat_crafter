export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@pinia/nuxt", "nuxt-plotly"],
  plugins: [],
  devtools: { enabled: false },
  css: ["@/app.css"],
  ssr: false,
  devtools: {
    enabled: true,
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
