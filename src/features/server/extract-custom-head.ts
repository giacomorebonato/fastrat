export const extractCustomHead = (html: string) => {
	let chunks = html.split('id="custom-head">')

	if (chunks.length > 1) {
		chunks = chunks[1].split('</div>')

		return chunks[0]
	}

	return ''
}
