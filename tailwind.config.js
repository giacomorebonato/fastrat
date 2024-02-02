/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		fontFamily: {
      cardo: ["Cardo", "sans-serif"]
    },
		extend: {},
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

export default config
