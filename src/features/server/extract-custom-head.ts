export const extractCustomHead = (html: string) => {
	let chunks = html.split('id="custom-head">')
	chunks = chunks[1].split('</div>')

	return chunks[0]
}
