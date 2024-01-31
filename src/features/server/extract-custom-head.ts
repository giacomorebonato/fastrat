const CUSTOM_HEAD_BEGINNING = '<div id="custom-head"'

export const extractCustomHead = (
	html: string,
): null | { start: number; end: number; code: string } => {
	let chunks = html.split(CUSTOM_HEAD_BEGINNING)

	if (chunks.length > 1) {
		const start = chunks[0].length
		const end =
			start + CUSTOM_HEAD_BEGINNING.length + chunks[1].indexOf('</div>') + 6
		chunks = chunks[1].split('</div>')

		const code = chunks[0]

		return {
			code,
			start,
			end,
		}
	}

	return null
}
