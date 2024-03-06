import { expect, test } from 'vitest'
import { createTemplate } from '../create-template'

test('returns head and footer', () => {
	const { head, footer } = createTemplate()

	expect(head.endsWith(`<body><div id="root">`)).toBe(true)
	expect(footer.startsWith(`</div>`)).toBe(true)
	expect(footer.endsWith(`</body>\n</html>`)).toBe(true)
})
