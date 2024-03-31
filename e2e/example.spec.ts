import { expect, test } from '@playwright/test'
import { HtmlValidate } from 'html-validate/node'

test('creates a note and ensures note list is updated from websockets and that SSR is happening', async ({
	browser,
	page,
}) => {
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			throw Error(msg.text())
		}
	})
	await page.goto('http://localhost:3000/notes')
	// const wsPromise = getWebSocket(page)

	await expect(page).toHaveTitle(/FastRat/)
	await page.getByText('Logout').isVisible()
	await page.locator('textarea').isVisible()

	await page.getByTestId('btn-create-note').click()

	await page.waitForURL('http://localhost:3000/notes/*')

	const noteId = page.url().split('notes/').at(-1)

	await page.waitForSelector(`[data-testid=note-${noteId}]`)

	await page.locator('textarea').fill('Beautiful day')

	await page.waitForTimeout(2_000)

	await expect(page.locator(`[data-testid=note-${noteId}] span`)).toHaveText(
		'Beautiful day',
		{
			timeout: 1_000,
		},
	)

	// JS is disabled to ensure that HTML is not build client side
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

test(`it renders valid HTML`, async ({ browser }) => {
	const context = await browser.newContext()
	const page = await context.newPage()
	await page.goto('http://localhost:3000')

	const htmlvalidate = new HtmlValidate({
		extends: ['html-validate:recommended'],
		rules: {
			'no-trailing-whitespace': 0,
			'attribute-empty-style': 0,
			'valid-id': 0,
			'wcag/h32': 0,
			'prefer-native-element': 0,
			'no-implicit-button-type': 0,
		},
	})
	const html = await page.content()
	const report = await htmlvalidate.validateString(html)

	expect(report.valid).toBe(true)
})

test(`it redirects from server side when passing not existing id in the URL`, async ({
	page,
}) => {
	const response = await page.goto('http://localhost:3000/notes/12345')

	expect(response?.url()).toEqual('http://localhost:3000/notes')
})
