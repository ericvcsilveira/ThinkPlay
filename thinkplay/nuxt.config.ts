// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  plugins: [
    { src: '~/plugins/vue-toast', ssr: false }
  ],
})
