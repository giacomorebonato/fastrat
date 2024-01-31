import { expect, test } from 'vitest'
import { extractCustomHead } from '../extract-custom-head'

const example = `<html><div id="custom-head"><title>FastRat Pippo</title></div></html>`

test('extracts the content inside of the template', () => {
	const result = extractCustomHead(example)

	if (!result) {
		throw Error(`result shouldn't be null`)
	}

	const templateCode = example.slice(result.start, result.end)

	expect(result.code).toBe('<title>FastRat Pippo</title>')
	expect(templateCode).toBe(
		'<div id="custom-head"><title>FastRat Pippo</title></div>',
	)
})
