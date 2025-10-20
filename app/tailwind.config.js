module.exports = {
  content: ['../app/**/*.{js,jsx,ts,tsx}'],
  important: '#root',
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        IBM: ["IBM Plex Sans Thai", "sans-serif"],
       },
    },
  },
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [],
};
