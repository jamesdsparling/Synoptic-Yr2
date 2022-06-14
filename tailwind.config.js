/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkmode: false,
  corePlugins: {
    preflight: false, 
  },
  prefix: 'tw-',
  content: [".public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ["'Poppins'", 'sans-serif']
      },
      backroundImage: {
        'hero': "url('./assets/images/hero.jpg')"
      }
    },
  },
  plugins: [],
}
