import { expect, test } from 'vitest'
import { extractCustomHead } from '../extract-custom-head'

const example = `<html><template id="custom-head"><title>FastRat Pippo</title></template></html>`

test('extracts the content inside of the template', () => {
	const { code, customHeadStart, customHeadEnd } = extractCustomHead(example)

	expect(code).toBe('<title>FastRat Pippo</title>')
	expect(
		example.substring(0, customHeadStart) + example.substring(customHeadEnd),
	).toBe('<html></html>')
})
