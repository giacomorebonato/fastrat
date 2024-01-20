/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		fontFamily: {
      'open-sans': ["OpenSans", "sans-serif"]
    },
		extend: {},
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

export default config
