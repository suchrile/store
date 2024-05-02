// @ts-nocheck
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  modules: ['@nuxtjs/eslint-module'],
  css: [
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
    '@/assets/theme.css',
    '@/assets/styles.css'
  ],
  build: {
    transpile: ['primevue']
  },
  runtimeConfig: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpBotUser: process.env.SMTP_BOT_USER,
    smtpInfoUser: process.env.SMTP_INFO_USER,
    smtpUserName: process.env.SMTP_USER_NAME,
    smtpBotPassword: process.env.SMTP_BOT_PASSWORD,
    smtpInfoPassword: process.env.SMTP_INFO_PASSWORD
  },
  app: {
    head: {
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' }
      ],
      meta: [
        {
          name: 'format-detection',
          content: 'telephone=no, email=no, address=no, date=no'
        },
        { name: 'theme-color', content: '#ffffff' }
      ]
    }
  }
})
