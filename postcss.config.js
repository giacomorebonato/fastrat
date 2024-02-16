const config = {
	plugins: {
		autoprefixer: {},
		tailwindcss: {},
		// https://tailwindcss.com/docs/optimizing-for-production
		...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
	},
}

export default config
