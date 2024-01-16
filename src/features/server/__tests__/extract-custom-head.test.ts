import { expect, test } from 'vitest'
import { extractCustomHead } from '../extract-custom-head'

const example = `<html><div id="custom-head"><title>FastRat Pippo</title></div></html>`

test('extracts the content inside of the template', () => {
	const code = extractCustomHead(example)

	expect(code).toBe('<title>FastRat Pippo</title>')
})
