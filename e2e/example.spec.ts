import { Page, expect, test } from '@playwright/test'
import { type WebSocket } from '@playwright/test'

const getWebSocket = (page: Page): Promise<WebSocket> => {
	return new Promise((resolve) => {
		page.on('websocket', resolve)
	})
}

test('creates a note and ensures note list is updated from websockets', async ({
	page,
}) => {
	await page.goto('http://localhost:3000')
	const ws = await getWebSocket(page)

	await expect(page).toHaveTitle(/FastRat/)
	await page.getByText('Logout').isVisible()
	await page.locator('textarea').isVisible()

	await page.getByText('Create Note').click()

	await page.waitForURL('http://localhost:3000/notes/*')

	const noteId = page.url().split('notes/').at(-1)

	await page.waitForSelector(`[data-testid=note-${noteId}]`)

	await page.locator('textarea').fill('Beautiful day')

	await ws.waitForEvent('framereceived', {
		predicate: (ev) => {
			return (
				JSON.parse(ev.payload.toString()).result.data.json.content ===
				'Beautiful day'
			)
		},
	})

	const text = await page
		.locator(`[data-testid=note-${noteId}] span`)
		.textContent()

	expect(text).toEqual('Beautiful day')
})
