// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Development server configuration
  devServer: {
    port: 5000
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // App configuration
  app: {
    head: {
      title: 'Irvine Onnuri Choir',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Irvine Onnuri Choir Management System' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api'
    }
  },

  // SSR configuration (SPA mode for Vercel)
  ssr: false,

  // Compatibility date
  compatibilityDate: '2025-09-20'
})
