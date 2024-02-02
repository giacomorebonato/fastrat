import { Page, expect, test } from '@playwright/test'
import { type WebSocket } from '@playwright/test'

const getWebSocket = (page: Page): Promise<WebSocket> => {
	return new Promise((resolve) => {
		page.on('websocket', resolve)
	})
}

test('creates a note and ensures note list is updated from websockets and that SSR is happening', async ({
	browser,
	page,
}) => {
	await page.goto('http://localhost:3000/notes')
	const ws = await getWebSocket(page)

	await expect(page).toHaveTitle(/FastRat/)
	await page.getByText('Logout').isVisible()
	await page.locator('textarea').isVisible()

	await page.getByTestId('btn-create-note').click()

	await page.waitForURL('http://localhost:3000/notes/*')

	const noteId = page.url().split('notes/').at(-1)

	await page.waitForSelector(`[data-testid=note-${noteId}]`)

	await page.locator('textarea').fill('Beautiful day')

	await ws.waitForEvent('framereceived', {
		predicate: (ev) => {
			const content = JSON.parse(ev.payload as string).result.data.json.content
			const found = content === 'Beautiful day'
			return found
		},
	})

	const text = await page
		.locator(`[data-testid=note-${noteId}] span`)
		.textContent()

	expect(text).toEqual('Beautiful day')

	const context = await browser.newContext({
		javaScriptEnabled: false,
	})

	const pageWithoutJS = await context.newPage()
	await pageWithoutJS.goto(`http://localhost:3000/notes/${noteId}`)

	const content = await pageWithoutJS.content()

	expect(content).toContain(
		'<textarea class="textarea textarea-bordered w-full">Beautiful day</textarea>',
	)
	expect(content).toContain(
		`<title data-rh="true">Fastrat - Beautiful day</title>`,
	)
})
