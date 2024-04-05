import { expect, test } from 'vitest'
import { createTemplate } from '#/server/create-template'

test('returns head and footer', () => {
	const { head, footer } = createTemplate(null, 'production')

	expect(head.endsWith(`<body><div id="root">`)).toBe(true)
	expect(head).includes(`<link rel="manifest" href="/manifest.webmanifest">`)
	expect(footer.startsWith(`</div>`)).toBe(true)
	expect(footer).not.includes(`<div id="root">`)
	expect(footer.endsWith(`</body>\n</html>`)).toBe(true)
})
