import type { CoverageReportOptions } from 'monocart-coverage-reports'

// https://github.com/cenfun/monocart-coverage-reports
const coverageOptions: CoverageReportOptions = {
	name: 'Playwright Coverage Report',

	reports: ['console-details', 'v8', 'lcovonly'],

	// entryFilter: {
	//     '**/node_modules/**': false,
	//     '**/*.js': true
	// },
	sourceFilter: 'src/**/*.{ts,tsx}',
	// sourceFilter: {
	//     '**/node_modules/**': false,
	//     '**/*.js': true
	// },

	outputDir: './coverage-reports',
}

export default coverageOptions
