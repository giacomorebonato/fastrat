import type { FullConfig } from '@playwright/test'
import MCR from 'monocart-coverage-reports'
import coverageOptions from './mcr.config'

async function globalSetup(config: FullConfig) {
	const mcr = MCR(coverageOptions)
	await mcr.cleanCache()
}

export default globalSetup
