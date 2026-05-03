export default defineNuxtConfig({
  ssr: false,
  devServer: {
    port: 5173
  },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],

  vuetify: {
    moduleOptions: {
      // you can configure vuetify native options here
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi'
      }
    }
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03'
})
