export const extractCustomHead = (html: string) => {
	let chunks = html.split('id="custom-head">')
	chunks = chunks[1].split('</div>')

	return {
		code: chunks[0],
		customHeadStart: html.indexOf('<template id="custom-head">'),
		customHeadEnd: html.indexOf('</template>') + 11,
	}
}
