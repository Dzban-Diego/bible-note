/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#5b3c88',
        'primaryLight': 'rgba(91,60,136,0.47)',
        'disable': '#575757',
        'disableLight': 'rgba(98,98,98,0.54)',
        'text': '#cbcbcb'
      },
    },
  },
  plugins: [],
};
