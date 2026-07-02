export default defineNuxtConfig({
  ssr: false,
  devServer: {
    port: 5173
  },
  app: {
    head: {
      title: 'Hospital Manager',
      meta: [
        { name: 'description', content: 'Sistem modern de gestiune spitalicească' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
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
      theme: {
        defaultTheme: 'hospitalModernTheme',
        themes: {
          hospitalModernTheme: {
            dark: false,
            colors: {
              primary: '#4F46E5',
              secondary: '#0D9488',
              accent: '#0EA5E9',
              background: '#F8FAFC',
              surface: '#FFFFFF',
              error: '#EF4444',
              info: '#3B82F6',
              success: '#10B981',
              warning: '#F59E0B',
            }
          }
        }
      },
      icons: {
        defaultSet: 'mdi'
      }
    }
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03'
})
