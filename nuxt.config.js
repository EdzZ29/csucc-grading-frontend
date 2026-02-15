export default {
  //  Merged 'head' sections (Title/Meta + Fonts)
  head: {
    title: 'Grading System | College of Engeneering and Information Technology',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml+png+jpg+jpeg', href: '/ceit-logo.png' }, ,
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Epunda+Slab:ital,wght@0,300..900;1,300..900&family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
      }
    ]
  },

  css: [
    '@/assets/css/tailwind.css',
  ],

  // ✅ FIXED: Merged 'build' sections (PostCSS + Transpile)
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    transpile: ['html2pdf.js', 'jspdf', 'fast-png'],
  },

  plugins: [
    { src: '~/plugins/handsontable.js', mode: 'client' },
    { src: '~/plugins/html2pdf.client.js', mode: 'client' }
  ],

  components: true,

  buildModules: [
    '@nuxt/postcss8',
  ],

  modules: [
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: 'http://localhost:9000/api',
    credentials: true
  },

  server: {
    port: 7000
  }
}